import { NextResponse } from 'next/server';

const GHL_API = 'https://services.leadconnectorhq.com';
const ENTITY_KEY = 'casper_group';
const RETRY_DELAY_MS = 5 * 60 * 1000;
const CASPER_SUPABASE_URL = process.env.CASPER_SUPABASE_URL || 'https://qhgmukwoennurwuvmbhy.supabase.co';

function json(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function clean(value, max = 500) {
  return typeof value === 'string'
    ? value.trim().replace(/[<>]/g, '').slice(0, max)
    : '';
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function buildAttribution(request, body) {
  const url = clean(body.sourceUrl || request.headers.get('referer'), 1000);
  const referrer = clean(body.referrer, 1000);
  const utm = safeObject(body.utm);
  return {
    sourceUrl: url || null,
    referrer: referrer || null,
    utm: {
      source: clean(utm.source, 120) || null,
      medium: clean(utm.medium, 120) || null,
      campaign: clean(utm.campaign, 180) || null,
      term: clean(utm.term, 180) || null,
      content: clean(utm.content, 180) || null,
    },
  };
}

async function supabaseRequest(path, init = {}) {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('Durable intake storage is not configured.');
  }

  return fetch(`${CASPER_SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
}

async function persistSubmission(payload) {
  const insert = await supabaseRequest('cg_web_intake_submissions?on_conflict=idempotency_key', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!insert.ok) {
    throw new Error(`Durable intake write failed (${insert.status}).`);
  }

  const insertedRows = await insert.json();
  if (Array.isArray(insertedRows) && insertedRows[0]?.id) return insertedRows[0];

  const existing = await supabaseRequest(
    `cg_web_intake_submissions?idempotency_key=eq.${encodeURIComponent(payload.idempotency_key)}&select=*&limit=1`
  );
  if (!existing.ok) throw new Error('Unable to resolve the accepted submission.');
  const rows = await existing.json();
  if (!Array.isArray(rows) || !rows[0]?.id) throw new Error('Unable to resolve the accepted submission.');
  return rows[0];
}

async function ensureDelivery(submissionId, locationId) {
  const insert = await supabaseRequest('cg_web_intake_deliveries?on_conflict=submission_id,provider', {
    method: 'POST',
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({
      submission_id: submissionId,
      provider: 'highlevel',
      intended_entity_key: ENTITY_KEY,
      destination_location_id: locationId || null,
      status: 'pending',
    }),
  });
  if (!insert.ok) throw new Error(`Delivery outbox write failed (${insert.status}).`);

  const insertedRows = await insert.json();
  if (Array.isArray(insertedRows) && insertedRows[0]?.id) return insertedRows[0];

  const existing = await supabaseRequest(
    `cg_web_intake_deliveries?submission_id=eq.${encodeURIComponent(submissionId)}&provider=eq.highlevel&select=*&limit=1`
  );
  if (!existing.ok) throw new Error('Unable to resolve the delivery job.');
  const rows = await existing.json();
  if (!Array.isArray(rows) || !rows[0]?.id) throw new Error('Unable to resolve the delivery job.');
  return rows[0];
}

async function patchSubmission(id, values) {
  await supabaseRequest(`cg_web_intake_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
}

async function patchDelivery(id, values) {
  await supabaseRequest(`cg_web_intake_deliveries?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
}

async function deliverToHighLevel({ submission, delivery, locationId, pitToken }) {
  const now = new Date().toISOString();
  await patchDelivery(delivery.id, {
    status: 'processing',
    attempt_count: Number(delivery.attempt_count || 0) + 1,
    last_attempt_at: now,
    leased_at: now,
    lease_owner: 'casper-website-api',
    last_error: null,
  });
  await patchSubmission(submission.id, { status: 'processing' });

  const nameParts = submission.full_name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const formTag = `form_${submission.form_type}`;
  const contactPayload = {
    firstName,
    lastName,
    email: submission.email,
    phone: submission.phone || undefined,
    locationId,
    source: `Casper Group Website: ${submission.form_type.replace(/_/g, ' ')}`,
    tags: [formTag, 'website_form', 'casper_group', `form_${submission.submitted_at.slice(0, 10)}`],
  };
  Object.keys(contactPayload).forEach((key) => {
    if (contactPayload[key] === undefined) delete contactPayload[key];
  });

  const contactRes = await fetch(`${GHL_API}/contacts/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pitToken}`,
      Version: '2021-07-28',
    },
    body: JSON.stringify(contactPayload),
    cache: 'no-store',
  });

  if (!contactRes.ok) {
    const errorText = (await contactRes.text()).slice(0, 1500);
    throw new Error(`HighLevel contact upsert failed (${contactRes.status}): ${errorText}`);
  }

  const contactData = await contactRes.json();
  const contactId = contactData?.contact?.id || null;

  if (contactId) {
    const notes = [
      `CASPER GROUP — ${submission.form_type.toUpperCase().replace(/_/g, ' ')}`,
      `Submission ID: ${submission.id}`,
      `Submitted: ${submission.submitted_at}`,
      `Source URL: ${submission.source_url || 'Unknown'}`,
      `Referrer: ${submission.referrer || 'Unknown'}`,
      '',
      ...Object.entries(safeObject(submission.fields)).map(
        ([key, value]) => `${key.replace(/_/g, ' ')}: ${String(value).slice(0, 1000)}`
      ),
    ].join('\n');

    const noteRes = await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pitToken}`,
        Version: '2021-07-28',
      },
      body: JSON.stringify({ body: notes }),
      cache: 'no-store',
    });
    if (!noteRes.ok) {
      console.error('Casper GHL note write failed:', noteRes.status);
    }
  }

  await patchDelivery(delivery.id, {
    status: 'succeeded',
    external_contact_id: contactId,
    succeeded_at: new Date().toISOString(),
    leased_at: null,
    lease_owner: null,
    last_error: null,
  });
  await patchSubmission(submission.id, { status: 'delivered' });
  return contactId;
}

export async function POST(request) {
  let submission;
  let delivery;

  try {
    const body = await request.json();
    const formType = clean(body.formType, 80);
    const name = clean(body.name, 160);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 50);
    const fields = safeObject(body.fields);
    const consent = safeObject(body.consent);
    const { sourceUrl, referrer, utm } = buildAttribution(request, body);

    if (!/^[a-z0-9_\-]+$/i.test(formType) || name.length < 2 || !validEmail(email)) {
      return json({ success: false, error: 'Enter a valid form type, name, and email.' }, 400);
    }

    if (body.entityKey && clean(body.entityKey, 80) !== ENTITY_KEY) {
      return json({ success: false, error: 'This endpoint only accepts Casper Group corporate inquiries.' }, 409);
    }

    const clientKey = clean(body.idempotencyKey || request.headers.get('x-idempotency-key'), 160);
    const idempotencyKey = clientKey || crypto.randomUUID();

    submission = await persistSubmission({
      idempotency_key: idempotencyKey,
      entity_key: ENTITY_KEY,
      form_type: formType,
      full_name: name,
      email,
      phone: phone || null,
      source_url: sourceUrl,
      referrer,
      utm,
      consent,
      fields,
      status: 'accepted',
    });

    const locationId = clean(process.env.GHL_LOCATION_ID, 120);
    delivery = await ensureDelivery(submission.id, locationId);

    if (delivery.status === 'succeeded') {
      return json({
        success: true,
        accepted: true,
        submissionId: submission.id,
        crmStatus: 'delivered',
        message: 'Your inquiry is already recorded and delivered.',
      });
    }

    const pitToken = process.env.GHL_PIT_TOKEN;
    const verifiedEntity = clean(process.env.GHL_VERIFIED_ENTITY_KEY, 80);

    if (!pitToken || !locationId || verifiedEntity !== ENTITY_KEY) {
      const error = 'HighLevel destination is not yet verified for casper_group.';
      await patchDelivery(delivery.id, {
        status: 'failed',
        last_error: error,
        next_attempt_at: new Date(Date.now() + RETRY_DELAY_MS).toISOString(),
        leased_at: null,
        lease_owner: null,
      });
      await patchSubmission(submission.id, { status: 'accepted' });
      return json({
        success: true,
        accepted: true,
        submissionId: submission.id,
        crmStatus: 'queued',
        message: 'Your inquiry is safely recorded and queued for our team.',
      }, 202);
    }

    try {
      const contactId = await deliverToHighLevel({ submission, delivery, locationId, pitToken });
      return json({
        success: true,
        accepted: true,
        submissionId: submission.id,
        crmStatus: 'delivered',
        contactId,
        message: 'Your inquiry is recorded and delivered to our team.',
      });
    } catch (deliveryError) {
      const error = deliveryError instanceof Error ? deliveryError.message : 'HighLevel delivery failed.';
      await patchDelivery(delivery.id, {
        status: 'failed',
        last_error: error.slice(0, 2000),
        next_attempt_at: new Date(Date.now() + RETRY_DELAY_MS).toISOString(),
        leased_at: null,
        lease_owner: null,
      });
      await patchSubmission(submission.id, { status: 'accepted' });
      console.error('Casper corporate CRM delivery queued:', error);
      return json({
        success: true,
        accepted: true,
        submissionId: submission.id,
        crmStatus: 'queued',
        message: 'Your inquiry is safely recorded and queued for our team.',
      }, 202);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error.';
    console.error('Casper corporate form API error:', message);
    return json({ success: false, accepted: false, error: 'We could not safely record your inquiry. Please try again.' }, 503);
  }
}
