/* The demo questionnaire, defined once: the form renders these steps and
   the server validates and emails against the same list, so a question
   added here appears in both. Order is the order of the email. */

export type DemoAnswers = Record<string, string | string[]>;

type Base = { id: string; label: string; required?: boolean; hint?: string };
export type DemoField =
  | (Base & { kind: "text" | "email" | "tel"; placeholder?: string; autoComplete?: string })
  | (Base & { kind: "textarea"; placeholder?: string })
  | (Base & { kind: "choice"; options: string[] }) // one answer
  | (Base & { kind: "multi"; options: string[] }); // any number

export type DemoStep = { title: string; intro: string; fields: DemoField[] };

export const DEMO_STEPS: DemoStep[] = [
  {
    title: "About you",
    intro: "Who we'll be talking to.",
    fields: [
      { id: "name", label: "Your name", kind: "text", required: true, autoComplete: "name" },
      { id: "role", label: "Your role", kind: "choice", required: true, options: ["Owner", "Manager", "Dispatcher", "Driver", "Other"] },
      { id: "email", label: "Email", kind: "email", required: true, autoComplete: "email" },
      { id: "phone", label: "Phone", kind: "tel", autoComplete: "tel", hint: "If you'd rather we called." },
      { id: "company", label: "Company name", kind: "text", required: true, autoComplete: "organization" },
      { id: "city", label: "City and province", kind: "text", required: true, placeholder: "Kentville, NS" },
    ],
  },
  {
    title: "Your fleet",
    intro: "Rough numbers are fine.",
    fields: [
      { id: "vehicles", label: "How many cars", kind: "choice", required: true, options: ["1–5", "6–15", "16–40", "41–100", "More than 100"] },
      { id: "drivers", label: "How many drivers", kind: "choice", options: ["1–5", "6–15", "16–40", "41–100", "More than 100"] },
      {
        id: "vehicleTypes",
        label: "Vehicle types",
        kind: "multi",
        options: ["Cars", "SUVs or minivans", "Wheelchair-accessible", "Larger vans or buses"],
      },
      { id: "hours", label: "When you run", kind: "choice", options: ["24 hours", "Set hours"] },
    ],
  },
  {
    title: "How you work today",
    intro: "So we can show you the parts that matter to you.",
    fields: [
      {
        id: "bookingChannels",
        label: "How bookings come in",
        kind: "multi",
        options: ["Phone calls", "An app", "A website", "Text messages", "Taxi stands or the street"],
      },
      {
        id: "currentSystem",
        label: "What you dispatch with now",
        kind: "choice",
        options: ["Paper and phone", "iCabbi", "Other dispatch software", "Not sure"],
      },
      { id: "currentSystemName", label: "Which software, if another", kind: "text" },
      { id: "ridesPerWeek", label: "Rides in a typical week", kind: "choice", options: ["Under 100", "100–500", "500–2,000", "Over 2,000", "Not sure"] },
      { id: "cardShare", label: "How passengers pay", kind: "choice", options: ["Mostly cash", "About half and half", "Mostly card", "Not sure"] },
      {
        id: "rideTypes",
        label: "Rides you also do",
        kind: "multi",
        options: ["Scheduled rides", "Medical or hospital", "Business accounts", "Students or schools"],
      },
    ],
  },
  {
    title: "What you need",
    intro: "Last step.",
    fields: [
      {
        id: "needs",
        label: "What you most want to fix",
        kind: "multi",
        options: [
          "Phones always busy",
          "No record of rides",
          "Taking card payments",
          "An app for passengers",
          "Keeping track of drivers",
          "Scheduled rides",
        ],
      },
      { id: "timeline", label: "When you'd like to start", kind: "choice", required: true, options: ["As soon as possible", "In 1–3 months", "Just looking"] },
      { id: "bestTime", label: "Best time to reach you", kind: "text", placeholder: "Weekday mornings" },
      { id: "heardFrom", label: "How you heard about us", kind: "text" },
      { id: "notes", label: "Anything else", kind: "textarea" },
    ],
  },
];

export const DEMO_FIELDS: DemoField[] = DEMO_STEPS.flatMap((s) => s.fields);
