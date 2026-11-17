# Privacy Policy

**Effective date:** 1 October 2026 · **Last updated:** 16 November 2026

Vellon ("Vellon", "we", "us") makes **Vellon Dispatch** — taxi dispatch software
that we license to taxi companies. We are a software vendor. We do not operate
taxis, we do not employ or contract drivers, and we do not arrange
transportation. When you book a ride, your contract for that ride is with the
taxi company, not with us.

This policy explains what personal information the Vellon Dispatch mobile app,
the dispatch dashboard, and the Vellon websites (vellon.ca and dispatch.vellon.ca)
collect, why, who it is shared
with, where it is stored, and how to get it back or have it deleted.

It applies to four groups of people, and what we hold is materially different for
each. Read the section that describes you:

- [Passengers](#passengers) — you booked a ride in the app
- [Drivers](#drivers) — you drive for a taxi company that uses Vellon Dispatch
- [Dispatch staff](#dispatch-staff) — you use the dispatch dashboard
- [Phone bookings](#phone-bookings-guest-passengers) — you called the taxi company and never used the app

---

## Who is responsible for your information

Two organisations are involved, and they are responsible for different things.

**The taxi company** decides who to dispatch, keeps the record of your trips, and
is the organisation whose service you are using. For trip records, dispatch
decisions, and driver shift and location history, the taxi company is the
organisation in control, and Vellon holds and processes that information **on its
behalf and under its instructions**.

**Vellon** is responsible for the account and credential layer — your login, your
device's notification token, and the security of the platform itself — and for the
Vellon websites.

In practice: if you want a trip record corrected, the taxi company decides; if
you want your account closed, that is built into the app and we handle it. Either
way you can start by contacting us at **support@vellon.ca** and we will route it.

---

## What we never collect

We want to be specific about this, because it is a genuine limit on the system
rather than a promise about our intentions.

- **We never receive your card number.** Card details are captured by Stripe's own
  secure input inside the app and sent directly to Stripe. What reaches our
  systems is a Stripe reference plus the card brand, last four digits, expiry
  month and year, and cardholder name if you supplied one. The full number, the
  CVC, and the magnetic-stripe equivalent never touch our servers, and we could
  not produce them if asked.
- **The apps contain no analytics, advertising, tracking, or profiling software.**
  There are no third-party analytics SDKs, no advertising identifiers, no
  cross-app or cross-site tracking, and no data brokers. We do not sell personal
  information, and we do not share it for advertising.
- **We do not collect your date of birth or age**, and we therefore cannot verify
  age. See [Children](#children).
- **We do not record audio or video.** Masked phone calls between passengers and
  drivers are connected by Twilio and are **not recorded**; we keep only the fact
  that a call occurred, and its duration.

---

## Passengers

### What we collect and why

| Information | Why we have it |
|---|---|
| Name | Shown to your driver so they can find you; printed on receipts |
| Mobile number | How you sign in, unless you sign in by email; and how ride reminders reach you by SMS |
| Email address (optional) | Emailed receipts, and another way to sign in |
| Profile photo (optional) | Shown to your driver at pickup |
| Pickup and drop-off addresses and coordinates | To price, dispatch, and complete the ride |
| Trip history — times, addresses, fare, payment method, status | Your ride history, the taxi company's record, receipts, and disputes |
| Saved places (home, work, other) | Only what you choose to save, so you can rebook quickly |
| Card brand, last four digits, expiry, cardholder name | So you can recognise and choose a saved card. **Not the card number** |
| Star ratings and written reviews you submit | Shown to the taxi company; drivers see their score but **not** your comments |
| In-ride chat messages between you and your driver | Coordinating pickup |
| Push notification token and notification preferences | To send ride updates to your device |
| Reports you file about a driver | Safety and conduct investigations by the taxi company |
| Which taxi company your account is with | The company whose app you installed, or the one you chose or whose link you opened in the Vellon app — not by us tracking you |

**Your approximate location** is used once, when you open the map, to centre it
and offer nearby pickup points. The passenger app does **not** track your
location continuously and does not collect location in the background. You can
decline the permission and type an address instead.

**Student discounts (only if you use them).** Verifying a student discount
collects a **second, institutional email address** and which institution it
belongs to, separately from your account email. We send a one-time code to that
address; the code expires and is then discarded. We do not receive your student
record, enrolment status, or grades.

### Who your information is shared with

- **Your driver** sees your first name, your photo if you set one, your pickup and
  drop-off, and your chat messages. **Your driver does not get your phone
  number.** If you and your driver need to speak or text, the call is connected
  through a temporary masked number, so neither of you sees the other's real
  number. That masked line is released after the trip.
- **The taxi company's dispatch staff** can see your rides with that company,
  including addresses, fare, your name and your contact number — the same
  information a dispatcher would have written in a logbook.
- **Card payments are made on the taxi company's own Stripe account.** If you
  save a card, Stripe holds it for that company, together with your name and
  mobile number, and the company can see your payments in its Stripe records:
  amount, date, card brand, last four digits and cardholder name. The company
  does not get your card number either.
- **If you pay with Apple Pay**, the payment is set up between Apple and Stripe,
  and Apple's own privacy policy covers what Apple processes. We receive only the
  card brand, the last four digits and the fact that Apple Pay was used, so your
  receipt can show how you paid.
- **Other taxi companies get nothing.** Companies using Vellon Dispatch are
  separated at the database level and cannot see each other's passengers or
  rides. Your account exists with one company only. If you use the app with a
  second company, you have a separate account there, and the two share nothing.
- **Vellon** can see ride and fare records, because our fee is a percentage of
  fares and because we operate and support the system.

---

## Drivers

Everything in the passenger section applies to your own account where relevant.
Two things are specific to driving, and one of them is the most sensitive
information on the platform.

### Location while you are on shift

**Read this section in full.** It describes the most sensitive information on the
platform, and we would rather you knew exactly what it is than agreed to a
summary.

**When you go on shift, the app records your precise location continuously, and
it keeps doing so while the app is in the background.** This is how dispatch
assigns you the nearest job and how your passenger watches you approach. It is
also the trail your company uses to answer "which car was where, and when" — the
function a physical GPS tracker in the vehicle would serve.

Specifically:

- It starts when you go online and **stops when you go offline.** It does not run
  when you are off shift.
- On Android you will see a permanent notification while it is running. On iOS you
  will see the system's blue location indicator. Both are there so it is never
  running invisibly.
- Your **current** position is shared with your dispatcher while you are on shift,
  and with your passenger during a ride.
- Your **history** — the route you drove, with speed, heading and timestamps — is
  kept **for 12 months** as your company's fleet record, then deleted
  automatically. This is the same record a physical GPS unit bolted into the
  vehicle would produce. Your company can use it to answer where a given car was
  at a given time, which is what lets it respond to a passenger complaint, a fare
  dispute, a chargeback, or an insurance or legal claim months after the fact. It
  covers your whole shift, not only the minutes you were carrying a passenger.
  See [Retention](#how-long-we-keep-things).

If you withdraw the location permission the app cannot dispatch to you, because
assignment is based on who is nearest. Going offline is the way to stop being
tracked.

### Other driver information

| Information | Why we have it |
|---|---|
| Name, mobile number, email, profile photo | Identity, login, and what your passenger sees |
| Vehicle make, model, year, and licence plate | Shown to your passenger so they board the right car |
| Car number and driver number | Your company's own identifiers for you and the vehicle |
| Invite code used to register | Only a driver invited by the company can create a driver account |
| Shift start and end, and idle time | Your company's operational reporting |
| A device identifier | Your account works on one device at a time, to stop shared logins |
| Push notification token | Ride offers are pushed to your device |
| Star ratings and passenger reviews about you | You see your average score. Written comments go to the taxi company, not to you |
| Passenger reports about you | Safety and conduct investigations by the taxi company |
| Messages between you and dispatch, and notices your company broadcasts to drivers | Day-to-day operational communication. **Dispatch chat is not private from your employer** — it is a record of the company's own conversations with you |

**Drivers cannot be fully erased, and this is deliberate.** Completed trips are
the settlement record, the payout record and the safety record at the same time,
and they must stay attached to the driver who drove them. When you delete your
driver account we therefore **anonymise** it: your name, contact details, photo,
vehicle details and device are removed, your login is closed, and your phone
number is released so you can register again later — for example with a different
taxi company. The trips themselves remain in your former company's records.
See [Closing your account](#closing-your-account).

---

## Dispatch staff

Dispatchers and administrators sign in with an **emailed code** — we deliberately
do not use a phone number as a staff credential. We hold your name, your work
email address, the company you work for, and your role.

**Your actions in the dashboard are logged**, including assigning and reassigning
rides, editing rides, cancelling rides, and changing settings. The log records
which staff member did what and when. It exists so a decision about someone's
ride can be explained afterwards, and it is visible to your employer.

---

## Phone bookings (guest passengers)

If you telephone the taxi company and a dispatcher books for you, they enter
**your name and phone number** so a driver can be sent and so you can be reached.
That creates a minimal record in our system even though you never installed the
app or saw this policy at the time — which is exactly why this section exists.

That record holds your name, your number, and the trip. It holds no account, no
password, no card, and no location beyond the addresses of the trip itself.

To see it, correct it, or have it removed, contact the taxi company you called,
or write to us at **support@vellon.ca** and we will pass it on.

---

## Service providers, and where your information is stored

We use a small number of specialist providers. Each receives only what it needs
to do its job.

| Provider | What it handles | Where |
|---|---|---|
| **Supabase** (database, accounts, file storage) | Everything described above | **United States** (`us-east-1`) |
| **Stripe** | Card payments, on the taxi company's own Stripe account | United States, with global processing |
| **Twilio** | SMS codes and ride reminders; masked passenger–driver calls and texts | United States |
| **Resend** | Emailed receipts, sign-in codes, and messages sent through our website forms | United States |
| **Google Maps Platform** | Address search, distance and route calculation | Global |
| **Expo / Apple / Google** | Delivery of push notifications to your device | Global |
| **Vercel** | Hosting for the dispatch dashboard and the Vellon websites | Global |

**Your information is stored in the United States.** Our databases run in a US
region. This is permitted under Canadian privacy law, and we note it plainly
because it has a real consequence: while it is held there, US authorities may be
able to compel access to it under US law, through legal processes that differ
from Canada's. Our providers are bound by contract to process it only on our
instructions and to protect it.

When you type an address, that text is sent to Google to return suggestions.
When we calculate a fare or a route, pickup and drop-off coordinates are sent to
Google. Google is not told who you are.

**The Vellon websites** (vellon.ca and dispatch.vellon.ca) use Vercel Analytics,
which counts page views and referrers without cookies and without building a
profile of you. The websites set no advertising cookies and carry no third-party
trackers. The apps use no analytics at all.

**Contact and demo request forms.** When you send us a message or ask for a demo,
we receive what you type — your name, email address, your phone number if you give
it, your company, and whatever you choose to tell us about your fleet — by email,
through Resend. We use it only to reply to you and to talk with you about Vellon.
We keep it while we are in conversation with you, and delete it within 24 months
of our last contact, or sooner if you ask.

---

## How long we keep things

| What | How long |
|---|---|
| Trip records, receipts and fares | **At least 6 years.** These are the taxi company's financial records, and Canadian tax law requires a business to keep its books and records for that long. We hold them on the company's behalf |
| Driver location history — the trail of where a vehicle went while on shift | **12 months.** This is the taxi company's fleet record. A fare dispute, a passenger complaint, a card chargeback, or an insurance or legal claim about a specific trip can arrive months after it happened, and this is the only record of where the vehicle actually was. It is kept whether or not the vehicle was carrying a passenger at the time, because a question about a driver's whereabouts is not limited to the minutes they were on a fare |
| Your current location | Overwritten continuously; only the latest position is kept as "where you are now" |
| In-ride chat messages | Kept with the trip record |
| Masked call and text records — that a call or text happened, and how long the line was open | Kept with the trip record. **The two real phone numbers are discarded as soon as the masked line closes**, so what remains does not say who the parties were reachable at |
| Registrations started and never completed | Deleted automatically after 7 days |
| Passenger account and profile | Until you delete it |
| Driver account and profile | Until you delete it, then anonymised as described above |
| Safety reports about a driver | Kept even if the person who filed them deletes their account, with the names recorded as they were when filed. A report of unsafe conduct must not disappear because someone closed an app |

---

## Your choices and your rights

Under Canadian privacy law you can ask to **see** the personal information we hold
about you, to have it **corrected**, to **withdraw consent**, and to make a
**complaint**. In the app you can do much of this directly.

**Access.** Your ride history is in the app. For anything beyond it, write to
**support@vellon.ca**. We will respond within 30 days. If the information belongs
to the taxi company's records, we will tell you and pass the request on.

**Correction.** You can edit your name, photo, email and vehicle details in the
app. A trip record is a record of what happened and is corrected by the taxi
company, not overwritten by us.

**Withdrawing consent.** You can turn off location permission, turn off
notifications, delete saved cards and saved places, and stop using the service at
any time. Some withdrawals end the service rather than narrow it: without location
we cannot dispatch to a driver, and without a phone number or email we cannot
authenticate an account.

**Marketing.** We do not send marketing messages through the app. Messages you
receive are about a specific ride, or a code you asked for.

### Closing your account

You can delete your account yourself, in the app.

- **Passengers:** Profile → Delete account. Your profile, saved cards and saved
  places are deleted, the customer record Stripe holds for that company is deleted, and your
  rides and reviews are detached from you so the taxi company's financial records
  stay complete without naming you. You cannot delete mid-ride — finish or cancel
  the ride first, because a live card hold must not be left attached to nobody.
- **Drivers:** Profile → Delete account. Your account is anonymised and closed as
  described in the [Drivers](#drivers) section, and your phone number is released
  so you can sign up again later. If you are carrying a passenger, the request is
  honoured as soon as that trip ends.
- **Dispatch staff:** your employer controls your access. Ask your administrator.

Anonymisation is not reversible, and a deleted account cannot be restored.

---

## How we protect your information

- All traffic between the apps and our servers is encrypted in transit, and data
  is encrypted at rest by our hosting providers.
- Your signed-in session is **encrypted on your device**, with the encryption key
  held in the device's hardware-backed keychain or keystore. Someone reading the
  app's stored files without that key gets ciphertext.
- Access is enforced in the database itself, per company and per person, rather
  than only in the app — so one company cannot read another's data even through a
  faulty or modified client.
- Private fields, including phone numbers and email addresses, are withheld by
  default and released only to the specific people who need them.
- A driver account is usable on one device at a time.
- Payment card numbers are never in our systems to be lost.

No system is perfectly secure. If a breach occurs that creates a real risk of
significant harm to you, we will notify you and the Office of the Privacy
Commissioner of Canada as the law requires.

---

## Children

Vellon Dispatch is intended for adults. We do not collect date of birth and so we
cannot verify anyone's age. We do not knowingly collect information from children,
and we do not direct the service to them. If you believe a child has created an
account, write to **support@vellon.ca** and we will remove it.

---

## Changes to this policy

When this policy changes we post the new version at this address and update the
date at the top. If a change materially affects how we use your information, we
will also show a notice in the app. Continuing to use the service after a change
means you accept the updated policy.

---

## Contact us, and how to complain

**Vellon** — **support@vellon.ca**

Email reaches us fastest and is the best way to make a privacy request. If you
would rather correspond on paper, ask by email and we will give you a postal
address.

Write to us first — most requests are resolved quickly, and we will respond within
30 days.

If you are unsatisfied with our answer, you can complain to the **Office of the
Privacy Commissioner of Canada**: 30 Victoria Street, Gatineau, Quebec K1A 1H3 —
1-800-282-1376 — [priv.gc.ca](https://www.priv.gc.ca).

If your complaint is about a driver, a fare, or a dispatch decision, the taxi
company is the right first contact; their number is in the app under Help &
Support.
