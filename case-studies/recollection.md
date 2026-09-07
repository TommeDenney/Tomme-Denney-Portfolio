# Recollection

**A 360° capture and playback service for weddings: every camera on every moment, playing in step, opened from a link with no account and no app.**

*Usurper Interactive · Live at recollection.usurperinteractive.com · Unity 6, Astro, Cloudflare Workers + D1 + R2*

[NEEDS INPUT: what is my role against my co-founders' on Recollection specifically? The business plan is a three-person course project with Jennifer Ann Lawrence and Sebastian Salas; the four product repositories are under my account. Those are different splits and the metadata line should say which is which.]

## Where this came from

This is the fourth step of one line of work, and the only one that sells anything.

It began as research into Gaussian splatting — whether a real place could be reconstructed well enough to stand inside. That became the business case for **Usurper Interactive**, an immersive media studio for memory preservation, written for a graduate course on business models in the game industry: segmentation, a differentiation position, five-year headcount from four people to twelve, and pricing from a $750 portrait session to a $60,000 institutional archive. Then [Inhabiting Memory](/work/inhabiting-memory) argued the emotional half of it as a thesis — that the point of spatial media is return rather than observation.

Recollection is what happens when that argument has to survive a customer. The thesis critique was *optimise it, and show how this continues after graduation.* This is the answer: same claim, narrower scope, real hardware, and a price.

## The problem

A wedding video is one person's edit of your day. Someone chose the angle, chose the cut, and chose what you get to see — and every time you go back to it, you get their choice again. Meanwhile the thing you actually want is usually just out of frame: your mother's face during the vows, the table you were not at, the moment you were too busy to notice.

The design problem was not resolution or fidelity. It was **removing the editor from between a person and their own memory** — and doing it for an audience who will not install anything, will not make an account, and will mostly be over fifty.

## Constraints

- **Guests are not users.** They are a hundred people who receive a link at a wedding, on their own phones, once. Any step that assumes an app store, a password, or patience is a step that loses most of them.
- **This is somebody's wedding.** The privacy model has to be defensible to a couple, not to an engineer.
- **A bride is not a QA department.** The delivery pipeline has to be safe to re-run, because failures will happen while an event is being published and there is no time to reason about state.
- **Consumer XR hardware is unevenly capable.** iOS gives no vendor SDK access for glasses head-tracking; Android needs a minimum SDK the project did not have; a Quest can be reached through its browser or through a store, and those are not the same product.
- **Bootstrapped and part-time** for the first two years by the plan's own assumptions, which rules out anything needing a team to operate.

## What informed the design

- **The thesis directly.** Inhabiting Memory's finding that presence collapses the moment the medium becomes visible is the reason there is no interface in the way here: no login screen, no account, no app.
- **The business plan's own segmentation**, which put event planners and couples in the same funnel and forced the delivery model to work for both a paying client and a hundred guests who are not paying.
- **Hardware verification rather than spec sheets.** Two vendor claims were corrected only by testing on device, and the glasses tier exists in its current shape because an XREAL Air 2 Pro was confirmed to present as a plain 1920×1080 external display with no underfill.

## What I rejected

**An account system.** The obvious architecture and wrong for the audience. A guest redeems an access code, the server exchanges it for a device token scoped to exactly one experience, and that is the entire identity model. There is no login, no account, and no payment anywhere in the app — it does delivery and nothing else.

**A master code.** There was an all-access path during development and it was **removed rather than disabled**, with a note in the documentation forbidding its reintroduction. A skeleton key that opens any wedding is a thing that will eventually be used, leaked, or subpoenaed. The operator should not be able to walk into someone's day.

**The app store as the front door.** The position is that *the browser is the product and the store is optional.* A Quest reached through its browser needs a URL and nothing else; a store build needs a listing, a key, a review, and an install before anyone sees anything. The store path still exists for the offline case, but it is not how the product is met.

**A native desktop build.** Planned, then dropped in favour of the desktop browser, because a Unity build for Windows and macOS is two more artifacts to sign and ship for an audience already holding a link that works.

## Key design decisions

**Named moments instead of a timeline.** The day is cut into a sequence of named moments in the order they happened — *Down The Aisle*, *At The Altar*, *Father Daughter Dance* — and each one holds every camera that ran on it, playing together and in step. A scrub bar would make you search your own wedding. A named list makes you choose a memory.

**Switching angle without losing your place.** You can turn from the vows to your family watching you at the same instant, with nothing reloading. The cameras never stopped; the interface just stops pretending only one of them exists.

**Guests cannot pass it on.** A redeemed guest code returns 403 on any attempt to share onward — verified live, not assumed. The couple decides who is in the room. That is the same autonomy argument as the thesis, enforced in an access-control rule.

**Nobody types in a headset.** Typing in a headset is miserable, so the client does not. The headset shows six characters; the couple opens a page on the phone or laptop where they are already signed in and enters them there; the headset picks up its own session. The claim endpoint deliberately refuses a guest's access code, so a guest types six characters on the headset instead — six either way, and no path that quietly promotes a guest.

**One command, safe to repeat.** A folder of prepared footage becomes a live experience in a single command, and it inspects before it uploads. Uploads resume, database seeding is upserts, naming is idempotent — so *the correct response to any failure is the same command again.* That is a design decision about the operator's stress level, not a technical convenience.

**Not printing a number we would have to keep.** Guest-pass counts are deliberately absent from the site, because the number follows from pricing and publishing one early turns it into a promise.

## The result

A couple gets a private page that stays online, opened from anywhere on anything. Guests get a link, an email, or a code on the table to scan — no account, no app. Someone with glasses plugs them in and turns their head instead of dragging. Someone with a Quest opens the same link in its browser, presses one button, and is standing in the room at full scale. Someone with no signal uses the app, which downloads the whole recollection once and then needs no connection at all.

The site says it more plainly than I can: *just because it happens once does not mean you only get to be there once.*

Underneath: a Unity 6 viewer that plays equirectangular video into a skybox with head or finger movement driving the camera, an Astro marketing site carrying the browser viewer, a macOS admin app for publishing and access, and a Cloudflare Worker with D1 and R2 deciding per device which footage that device may see.

## Outcome

**Live, and honestly partial.** The site, sharing, contact form, mail from the new domain, the spam layers and the guest-cannot-share rule are all verified against the deployed backend. The iOS app builds and runs on an iPhone 17 Pro Max. The glasses tier passed on real hardware — external display and playback both. The QR encoder was verified by decoding six cases including UTF-8. The publishing pipeline was dry-run against 4.59 GB of real footage.

**And what is not:** the Android build has never been made. WebXR in a headset and phone-motion look-around in the browser are both written and have never been run on hardware. Glasses head-tracking in the browser is untested. iOS distribution is unconfigured — no team ID, no icon — which is submission paperwork rather than engineering, but it means the app is not in anyone's hands through a store.

[NEEDS INPUT: has Recollection captured or delivered an event for a paying client yet? This is the single most important fact on the page, and it decides whether the outcome reads as a shipped product or a launched one. I have written neither.]

## What I'd change

**Run the untested tiers or cut them.** Three delivery paths are written and unverified. Each one is currently a claim on the site's behalf that nobody has checked, and the honest options are a morning with the hardware or removing them until there is.

**Decide about the store properly.** "The browser is the product, the store is optional" is the right call for reach and it leaves the offline case half-built. The app is the only answer for a venue with no signal, and venues with no signal are common.

**Write the privacy model down for the customer.** No master key, guests cannot re-share, tokens scoped to one event — these are the most reassuring facts about the product and they exist only in an engineering document. A couple deciding whether to put their wedding on someone else's server should be able to read them.
