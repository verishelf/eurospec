import Link from "next/link";
import { BrandStrip } from "@/components/BrandStrip";

const services = [
  {
    title: "Diagnostics & Scanning",
    description:
      "Factory-level OBD diagnostics, coding, and module programming for European platforms.",
    icon: "🔍",
  },
  {
    title: "Scheduled Maintenance",
    description:
      "Oil services, filters, fluids, spark plugs, and full multi-point inspections tailored to OEM intervals.",
    icon: "🔧",
  },
  {
    title: "Brakes & Suspension",
    description:
      "Pad and rotor service, caliper rebuilds, control arms, bushings, and alignment recommendations.",
    icon: "🛞",
  },
  {
    title: "Drivetrain Service",
    description:
      "Transmission fluid exchanges, differential service, and quattro / AWD system care.",
    icon: "⚙️",
  },
  {
    title: "Engine Performance",
    description:
      "Carbon cleaning, timing chain inspection, cooling system service, and performance diagnostics.",
    icon: "🏎️",
  },
  {
    title: "Electrical & Electronics",
    description:
      "Battery testing, lighting, sensors, comfort systems, and complex electrical fault finding.",
    icon: "⚡",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#0a0f1a]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/40 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Precision Automotive Technology
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Expert Care for{" "}
              <span className="text-[var(--accent)]">European</span> Vehicles
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
              EuroSpec Systems combines dealer-level diagnostics with independent
              craftsmanship. From routine maintenance to complex repairs, we keep
              your vehicle performing at its best.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[var(--accent-hover)]"
              >
                Schedule Service
              </Link>
              <Link
                href="/#services"
                className="rounded-md border border-[var(--border)] bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BrandStrip />

      <section id="services" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Comprehensive maintenance and repair solutions backed by modern
              diagnostic equipment and European vehicle expertise.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]/50 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="mb-4 text-3xl">{s.icon}</div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-[var(--border)] bg-[var(--card)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Why EuroSpec?
              </h2>
              <p className="mt-4 text-[var(--muted)] leading-relaxed">
                We focus exclusively on European vehicles so our technicians stay
                sharp on the platforms that matter. Every service is documented
                with clear findings, OEM-spec fluids and parts, and transparent
                recommendations.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Factory-level diagnostic tools and software",
                  "OEM and premium aftermarket parts options",
                  "Detailed multi-point inspections on every visit",
                  "Clear communication and no-surprise pricing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-xs">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 sm:p-10">
              <h3 className="text-xl font-semibold text-white">Our Approach</h3>
              <div className="mt-6 space-y-6">
                {[
                  { step: "01", title: "Diagnose", text: "Full scan and road test to identify issues accurately." },
                  { step: "02", title: "Communicate", text: "Clear findings and options before any work begins." },
                  { step: "03", title: "Execute", text: "Precision repairs with the right tools and procedures." },
                  { step: "04", title: "Verify", text: "Post-repair checks and road test for quality assurance." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <span className="text-sm font-bold text-[var(--accent)]">{s.step}</span>
                    <div>
                      <p className="font-medium text-white">{s.title}</p>
                      <p className="text-sm text-[var(--muted)]">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Schedule?
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Reach out to book a service appointment or request a diagnostic
              evaluation. We will get back to you promptly.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <form
              className="space-y-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
              action="#"
              method="POST"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="vehicle" className="block text-sm font-medium text-white">
                  Vehicle
                </label>
                <input
                  id="vehicle"
                  name="vehicle"
                  type="text"
                  className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder="e.g. 2015 Audi A4 Quattro"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder="Describe the service needed or issue you are experiencing..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                Send Request
              </button>
              <p className="text-center text-xs text-[var(--muted)]">
                Form is a template — connect to your preferred backend or form service.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
