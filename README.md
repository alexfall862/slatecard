# Kansas 2026 Democratic Slate

A one-page, mobile-first candidate slate built for QR-code traffic from volunteer scripts and materials. Zero dependencies — a single static page served by a tiny Node server.

## What's on the page

- All 15 Democratic nominees from [kansasdems.org/candidates](https://kansasdems.org/candidates), grouped by office (U.S. Senate, U.S. House, Governor, Statewide, State Board of Education), each linking to their campaign site
- Calls to action: register at [KSVotes.org](https://ksvotes.org), check registration at [VoterView](https://myvoteinfo.voteks.org/VoterView), and volunteer at [kansasdems.org/volunteer](https://kansasdems.org/volunteer)
- A sticky bottom bar keeps Register / Check status one tap away while scrolling — the two most valuable actions for someone who just scanned a QR code at their door
- Link to county parties for local races

## Deploy on Railway

1. Push this folder to a GitHub repo
2. In Railway: **New Project → Deploy from GitHub repo** and select the repo
3. Railway auto-detects Node and runs `npm start` — no config needed
4. Under **Settings → Networking**, click **Generate Domain** (or attach a custom domain)
5. Point your QR code at that URL

Alternatively, with the Railway CLI: `railway init && railway up` from this folder.

## Before you launch

- **Update the disclaimer** in the footer of `public/index.html` — replace `[Your Organization Name]` with your actual "Paid for by" line. Political materials generally require one; check what applies to your group.
- **Verify the dates.** The page shows Election Day (Tue, Nov 3, 2026) and the Kansas registration deadline (Oct 13, 2026 — 21 days prior). Confirm against the Secretary of State's calendar before printing QR materials.
- **Headshots** are hotlinked from kansasdems.org. If the KDP ever moves those images, the page falls back to initials automatically. For full independence, download the images into `public/images/` and update the `src` attributes.

## Editing candidates

All content lives in one file: `public/index.html`. Each candidate is a `.ballot-row` block — copy, paste, and edit to add or update entries. No build step.
