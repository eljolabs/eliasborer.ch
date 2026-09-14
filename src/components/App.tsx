import { useEffect, useState } from "react";
import DiversificationLab from "./DiversificationLab";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

// Preserve the site's existing brand marks; Lucide supplies interface icons.
function Linkedin({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.36 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.55v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V22H7.58V8z" />
    </svg>
  );
}
function Github({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

const linkedin = "https://www.linkedin.com/in/elias-borer-447324259/";
const github = "https://github.com/eljolabs";
const email = "hello@eliasborer.ch";
const sections = [
  ["about", "Profile"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["projects", "Work"],
  ["skills", "Toolkit"],
  ["contact", "Contact"],
];

function Nav() {
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => observer.observe(el));
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    let printDetails: HTMLDetailsElement[] = [];
    const beforePrint = () => {
      printDetails = [
        ...document.querySelectorAll<HTMLDetailsElement>("details:not([open])"),
      ];
      printDetails.forEach((detail) => {
        detail.open = true;
      });
    };
    const afterPrint = () => {
      printDetails.forEach((detail) => {
        detail.open = false;
      });
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", close);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* Theme works without storage. */
    }
  }
  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <a
          className="brand"
          href="#top"
          onClick={() => setOpen(false)}
          aria-label="Elias Borer, top"
        >
          <span className="brand-pip" />
          <span className="domain-brand">
            elias<span>borer.ch</span>
          </span>
        </a>
        <nav
          id="primary-nav"
          className={open ? "nav-links is-open" : "nav-links"}
          aria-label="Main navigation"
        >
          {sections.map(([id, title]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {title}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a
            className="icon-btn top-social"
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin />
          </a>
          <a
            className="icon-btn top-social"
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github />
          </a>
          <button
            className="icon-btn"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button
            className="icon-btn mobile-menu"
            title={open ? "Close navigation" : "Open navigation"}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="terminal-hero" id="top" aria-labelledby="hero-title">
      <div className="container">
        <div className="lab-profile-heading mono">
          <span>Personal profile / 2026</span>
          <span>Finance · Risk · Data</span>
        </div>
        <div className="terminal-hero-grid">
          <div className="terminal-hero-copy">
            <div className="availability">
              <span />
              Open to internships · Q1 2027
            </div>
            <h1 id="hero-title">
              Elias Borer<span>.</span>
            </h1>
            <p className="terminal-discipline">
              Accounting &<br />
              Corporate Finance.
            </p>
            <p className="terminal-bio">
              Working in operational risk at Baloise Asset Management and
              studying for the MACFin at HSG. Curious about the way markets
              work, and the data behind a good decision.
            </p>
            <p className="terminal-prompt mono">
              &gt; finance · risk · data
              <span className="prompt-cursor" aria-hidden="true">
                _
              </span>
            </p>
            <div className="terminal-hero-actions">
              <a className="btn btn-primary" href="#projects">
                View projects <ArrowDown size={16} />
              </a>
              <a
                className="btn btn-outline"
                href={linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin /> LinkedIn
              </a>
              <a
                className="btn btn-outline"
                href={github}
                target="_blank"
                rel="noreferrer"
              >
                <Github /> GitHub
              </a>
            </div>
            <dl className="terminal-profile-meta">
              <div>
                <dt>Based in</dt>
                <dd>Basel, CH</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Finance · Risk</dd>
              </div>
              <div>
                <dt>Toolkit</dt>
                <dd>Excel · R · Python</dd>
              </div>
            </dl>
          </div>
          <DiversificationLab />
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  number,
  title,
  note,
}: {
  number: string;
  title: string;
  note: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="section-number mono">{number} /</span>
        <h2>{title}</h2>
      </div>
      <span className="section-note mono">{note}</span>
    </div>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead number="01" title="A little context." note="The profile" />
        <div className="about-layout">
          <div>
            <p className="lede">
              I like understanding how things work.
              <br />
              <span className="muted">Especially when the details matter.</span>
            </p>
            <p className="body-copy">
              My background connects economics, operational risk and leadership.
              At Baloise Asset Management, I support risk governance and
              internal controls. Alongside my work, I am pursuing the Master in
              Accounting and Corporate Finance (MACFin) at the University of St.
              Gallen.
            </p>
            <p className="body-copy">
              I enjoy moving between the bigger picture and the underlying data:
              from studying the market’s response to SNB decisions to building
              my own financial research tools. Outside work, you’ll find me
              skiing, training or behind a camera.
            </p>
          </div>
          <dl className="profile-facts">
            <div>
              <dt>Currently</dt>
              <dd>
                Operational Risk & ICS<span>Baloise Asset Management</span>
              </dd>
            </div>
            <div>
              <dt>Academic focus</dt>
              <dd>
                Accounting & Corporate Finance
                <span>MACFin student · HSG</span>
              </dd>
            </div>
            <div>
              <dt>Leadership</dt>
              <dd>
                Military leadership experience
                <span>Swiss Armed Forces · Lieutenant · Platoon Commander</span>
              </dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>
                German / English / French<span>Native / C1 / B2</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

const experience = [
  {
    date: "02.2026 — present",
    title: "Working Student, Risk Management",
    org: "Baloise Asset Management AG",
    label: "Asset management",
    description:
      "Supporting operational risk management, internal controls and risk reporting in an asset management environment.",
    detail:
      "Maintaining risk documentation and the SAI360 GRC system. Supporting risk assessments, business continuity management and outsourcing risk management.",
    tags: ["Operational risk", "ICS / IKS", "SAI360", "Risk reporting"],
  },
  {
    date: "02.2025 — 01.2026",
    title: "Working Student, Claims Handling",
    org: "Baloise Versicherungen AG",
    label: "Insurance",
    description:
      "Independent assessment and settlement of glass, mobile device and household contents claims.",
    detail:
      "Owned case documentation and customer communication, applying internal guidelines with accuracy and a clear view of the individual case.",
    tags: ["Case assessment", "Customer communication", "Documentation"],
  },
  {
    date: "01.2023 — present",
    title: "Platoon Commander & Transport Officer",
    org: "Swiss Armed Forces",
    label: "Lieutenant · Militia",
    description:
      "Leading 40–50 soldiers across two hierarchy levels, with responsibility for people, planning and execution.",
    detail:
      "Transport route planning, operation of a transport centre with approximately 50 vehicles, and coordination of exceptional and heavy transports. Geniebataillon 23/1.",
    tags: ["Leadership", "Decision-making", "Logistics"],
  },
];

function Experience() {
  return (
    <section className="section section-tint" id="experience">
      <div className="container">
        <SectionHead
          number="02"
          title="Experience that adds up."
          note="Professional experience"
        />
        <div className="timeline">
          {experience.map((item, index) => (
            <article className="timeline-item" key={item.title}>
              <div className="timeline-date mono">
                <span
                  className={index === 0 ? "date-dot current" : "date-dot"}
                />
                {item.date}
                <span className="timeline-label">{item.label}</span>
              </div>
              <div className="timeline-content">
                <p className="organisation">{item.org}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <details>
                  <summary>
                    Responsibilities <ChevronDown size={15} />
                  </summary>
                  <p>{item.detail}</p>
                </details>
                <div className="tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHead
          number="03"
          title="The academic foundation."
          note="Education"
        />
        <div className="education-list">
          <article>
            <span className="mono">09.2026 — present</span>
            <div>
              <p className="organisation">University of St. Gallen (HSG)</p>
              <h3>M.A. Accounting and Corporate Finance</h3>
              <p>
                In progress · MACFin · Accounting, corporate finance, valuation
                and financial reporting.
              </p>
            </div>
            <span className="education-code">HSG</span>
          </article>
          <article>
            <span className="mono">2023 — 2026</span>
            <div>
              <p className="organisation">University of Basel</p>
              <h3>B.A. Business and Economics</h3>
              <p>Major in Economics · Minor in European Integration.</p>
              <a href="#snb-study" className="text-link">
                Thesis: SNB decisions and the Swiss stock market{" "}
                <ArrowUpRight size={15} />
              </a>
            </div>
            <span className="education-code">UNIBAS</span>
          </article>
          <article>
            <span className="mono">2017 — 2021</span>
            <div>
              <p className="organisation">Gymnasium Laufental-Thierstein</p>
              <h3>Swiss Matura</h3>
              <p>Specialisation in Biology and Chemistry.</p>
            </div>
            <span className="education-code">GLT</span>
          </article>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section section-work" id="projects">
      <div className="container">
        <SectionHead
          number="04"
          title="From curiosity to work."
          note="Selected projects & research"
        />
        <div className="project-grid">
          <article className="project">
            <div
              className="terminal-preview"
              aria-label="TradeTerminal technology overview"
            >
              <div className="terminal-top mono">
                <span>
                  <i /> TradeTerminal
                </span>
                <span>In development</span>
              </div>
              <div className="terminal-main">
                <span className="mono">Financial intelligence</span>
                <strong>
                  Markets.
                  <br />
                  Connected.
                </strong>
                <div className="terminal-modules mono">
                  <span>01 Market overview</span>
                  <span>02 Price research</span>
                  <span>03 Signal synthesis</span>
                </div>
              </div>
              <div className="terminal-bottom mono">
                <span>React + TypeScript</span>
                <span>Python + OpenBB</span>
              </div>
            </div>
            <div className="project-body">
              <span className="eyebrow mono">01 / Personal project</span>
              <h3>TradeTerminal</h3>
              <p>
                A financial research dashboard bringing market overviews, price
                charts and key statistics into one workspace. Built with React,
                a Python/FastAPI backend, OpenBB, PostgreSQL and Docker.
              </p>
              <div className="project-footer">
                <span className="project-status mono">In development</span>
                <a
                  className="text-link"
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub profile <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>
          <article className="project" id="snb-study">
            <div className="research-preview">
              <span className="mono">Research / Monetary policy</span>
              <div className="research-title">
                What happens
                <br />
                when the <span>SNB</span>
                <br />
                moves?
              </div>
              <div className="research-stats">
                <div>
                  <strong>206</strong>
                  <span>SPI equities</span>
                </div>
                <div>
                  <strong>1.3M+</strong>
                  <span>Observations</span>
                </div>
                <div>
                  <strong>2000–25</strong>
                  <span>Study period</span>
                </div>
              </div>
            </div>
            <div className="project-body">
              <span className="eyebrow mono">
                02 / Bachelor’s thesis · 2025
              </span>
              <h3>SNB interest rate decisions</h3>
              <p>
                An empirical event study of the Swiss stock market using R. The
                analysis separates expected policy decisions from surprises to
                examine how equities respond.
              </p>
              <details>
                <summary>
                  Research finding <ChevronDown size={15} />
                </summary>
                <p>
                  SNB decisions were largely anticipated by the market.
                  Significant effects appeared in the unexpected component of
                  the decisions.
                </p>
              </details>
              <div className="project-footer">
                <span className="mono">Econometrics · R · Event study</span>
                <a
                  className="text-link"
                  href={`mailto:${email}?subject=SNB%20event%20study`}
                >
                  Discuss the study <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const groups = [
    {
      name: "Finance & risk",
      subtitle: "In practice",
      items: [
        "Operational risk",
        "Internal control systems",
        "Risk documentation & reporting",
        "Financial economics",
      ],
    },
    {
      name: "Data & tools",
      subtitle: "My toolkit",
      items: [
        "Excel · advanced",
        "SAI360 · GRC workflows",
        "R · empirical research",
        "Python · developing proficiency",
        "AI / LLM tools",
      ],
    },
    {
      name: "Working with people",
      subtitle: "Beyond the spreadsheet",
      items: [
        "Military leadership",
        "Structured decision-making",
        "Clear documentation",
        "Customer communication",
      ],
    },
  ];
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead
          number="05"
          title="The working toolkit."
          note="Capabilities, with context"
        />
        <div className="skill-grid">
          {groups.map((group, index) => (
            <article key={group.name}>
              <span className="eyebrow mono">
                0{index + 1} / {group.subtitle}
              </span>
              <h3>{group.name}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  useEffect(() => {
    if (copyState === "idle") return;
    const timeout = window.setTimeout(() => setCopyState("idle"), 3000);
    return () => clearTimeout(timeout);
  }, [copyState]);
  async function copyEmail() {
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(email);
      else {
        // The LAN Docker preview uses HTTP, where the Clipboard API is unavailable.
        const input = document.createElement("textarea");
        input.value = email;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <SectionHead
          number="06"
          title="Let’s connect."
          note="Next chapter / Q1 2027"
        />
        <div className="contact-layout">
          <div>
            <p className="contact-lede">
              Good conversations
              <br />
              are a good start.
            </p>
            <p>
              Open to internships and junior roles across finance, risk and
              analytics from Q1 2027. Also happy to exchange ideas about markets,
              research or a project.
            </p>
          </div>
          <div className="contact-actions">
            <div className="email-row">
              <a href={`mailto:${email}`}>{email}</a>
              <button
                className="icon-btn"
                aria-label="Copy email address"
                title="Copy email address"
                onClick={copyEmail}
              >
                {copyState === "copied" ? <Check /> : <Copy />}
              </button>
            </div>
            <span className="copy-status mono" aria-live="polite">
              {copyState === "copied"
                ? "Email copied."
                : copyState === "error"
                  ? "Please select the email address to copy it."
                  : "Basel, Switzerland"}
            </span>
            <div className="social-links">
              <a href={linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} />
              </a>
              <a href={github} target="_blank" rel="noreferrer">
                <Github size={17} /> GitHub <ArrowUpRight size={14} />
              </a>
              <a href={`mailto:${email}`}>
                <Mail size={17} /> Email <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="container footer">
        <a className="footer-name" href="#top">
          eliasborer.ch
        </a>
        <span className="mono">© 2026 Elias Borer</span>
        <span className="mono">Finance / Risk / Data</span>
        <a className="text-link" href={`${import.meta.env.BASE_URL}privacy/`}>Privacy</a>
        <a className="text-link" href="#top">
          Back to top <ArrowUpRight size={15} />
        </a>
      </footer>
    </>
  );
}
