import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Casper Group",
  description:
    "How Casper Group Worldwide handles personal information across its websites and mobile apps, Casper Universe and Casper BOH.",
};

const UPDATED = "18 August 2026";

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px", lineHeight: 1.65 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ opacity: 0.7, marginTop: 0 }}>Last updated {UPDATED}</p>

      <p>
        This policy covers Casper Group Worldwide&rsquo;s website at caspergroupworldwide.com and
        our two mobile applications: <strong>Casper Universe</strong>, the guest-facing app, and{" "}
        <strong>Casper BOH</strong>, the internal back-of-house app used by our staff.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>Casper Universe.</strong> When you create an account we store your email address
        and the display name you choose. If you use rewards, we store your points balance and a
        record of each redemption so the balance can be verified. That is the whole of it.
      </p>
      <p>
        <strong>Casper BOH.</strong> Staff accounts store an email address, a name, and the role
        that determines what the person can see. The app then reads operational records belonging
        to Casper Group &mdash; venue status, schedules, reporting &mdash; not personal data about
        the person using it.
      </p>
      <p>
        <strong>The website.</strong> We do not run advertising trackers or third-party analytics
        that profile visitors. If you submit a form, we receive what you typed into it.
      </p>

      <h2>What we do not collect</h2>
      <p>
        Neither app collects your location, reads your photo library, uses your camera to gather
        data about you, or accesses your contacts. We do not sell personal information, and we do
        not share it with advertisers or data brokers. We do not build advertising profiles.
      </p>

      <h2>Where it lives</h2>
      <p>
        Account and rewards data is stored with Supabase, our database provider, on servers in the
        United States. Access is restricted by row-level security so an account can only reach its
        own records. Passwords are stored as salted hashes and are never readable by us.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Account data is kept while your account is open. Delete your account and we remove the
        account record and its rewards history. Backups roll off within 30 days. Staff accounts are
        removed when someone leaves.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us for a copy of your data, ask us to correct it, or ask us to delete it
        outright. Casper Universe also lets you delete your account from inside the app, and that
        deletion is honoured on the server, not just on your device.
      </p>

      <h2>Children</h2>
      <p>
        Our apps are not directed at children under 13 and we do not knowingly collect their
        information. If you believe a child has given us data, write to us and we will remove it.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially we will update the date above and, where the change
        affects how we handle existing data, tell account holders directly.
      </p>

      <h2>Contact</h2>
      <p>
        Casper Group Worldwide
        <br />
        <a href="mailto:info@caspergroupworldwide.com">info@caspergroupworldwide.com</a>
      </p>
    </main>
  );
}
