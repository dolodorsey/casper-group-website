import { renderPage, htmlResponse, handleOptin } from '../_a2p/a2p-pages.mjs';
const BRAND = {"key": "casper_group", "name": "Casper Group", "domain": "caspergroupworldwide.com", "home": "/", "privacyPath": "/privacy", "termsPath": "/terms", "programDescription": "Sign up for Casper Group texts for restaurant openings, menu launches, events, and offers from our restaurant brands.", "messageTypes": "Casper Group restaurant announcements, menu launches, event invitations, promotions, and order or reservation updates."};
export function GET() { return htmlResponse(renderPage('sms', BRAND)); }
export async function POST(request) { return handleOptin(request, BRAND); }
