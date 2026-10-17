import { ArrowUpRight } from 'lucide-react';
import { experience } from '../data/experience';
import { profile } from '../data/profile';
import { projectsByTier } from '../data/projects';
import type { Experience, Project } from '../data/types';
import { useDetail } from './DetailContext';

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function SectionHead({ id, title, sub }: { id: string; title: string; sub?: string }) {
  return (
    <div className="section-head">
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

/** One clickable line: title + short description on the left, a date on the right. */
function Row({
  title,
  desc,
  side,
  label,
  onOpen,
}: {
  title: React.ReactNode;
  desc?: string;
  side?: string;
  label: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" className="row" onClick={onOpen} aria-label={label}>
      <span className="row-main">
        <span className="row-title">{title}</span>
        {desc && <span className="row-desc">{desc}</span>}
      </span>
      {side && <span className="row-side">{side}</span>}
      <ArrowUpRight className="row-arrow" size={16} aria-hidden="true" />
    </button>
  );
}

function ExperienceList({ items }: { items: Experience[] }) {
  const { openDetail } = useDetail();
  return (
    <ul className="row-list">
      {items.map((e) => (
        <li key={e.id}>
          <Row
            title={
              <>
                {e.role} <span className="row-at">· {e.organization}</span>
              </>
            }
            desc={e.unit}
            side={e.dates}
            label={`${e.role}, ${e.organization}, ${e.dates} — open details`}
            onOpen={() => openDetail({ kind: 'experience', id: e.id })}
          />
        </li>
      ))}
    </ul>
  );
}

function ProjectList({ items }: { items: Project[] }) {
  const { openDetail } = useDetail();
  return (
    <ul className="row-list">
      {items.map((p) => (
        <li key={p.id}>
          <Row
            title={p.title}
            desc={p.previewDescription}
            side={p.status === 'In development' ? 'In development' : p.dates}
            label={`${p.title} — open project details`}
            onOpen={() => openDetail({ kind: 'project', id: p.id })}
          />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

export function Now() {
  return (
    <section id="now" className="section" aria-labelledby="now-title">
      <div className="container">
        <SectionHead id="now-title" title={profile.sections.now} />
        <ExperienceList items={experience.filter((e) => e.current)} />
      </div>
    </section>
  );
}

export function Built() {
  return (
    <section id="built" className="section" aria-labelledby="built-title">
      <div className="container">
        <SectionHead id="built-title" title={profile.sections.experiments} />
        <ProjectList items={projectsByTier('built')} />
      </div>
    </section>
  );
}

export function PastExperience() {
  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead id="exp-title" title={profile.sections.past} />
        <ExperienceList items={experience.filter((e) => !e.current)} />
      </div>
    </section>
  );
}

export function Footer() {
  const { links } = profile;
  const contacts = [
    links.x && { label: 'X', href: links.x, external: true },
    links.linkedin && { label: 'LinkedIn', href: links.linkedin, external: true },
    { label: links.email, href: `mailto:${links.email}`, external: false },
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];
  return (
    <footer className="footer" id="contact">
      <div className="container footer-inner">
        <ul className="text-links footer-links" aria-label="Contact">
          {contacts.map((c) => (
            <li key={c.href}>
              <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {c.label}
                {c.external && (
                  <>
                    <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>
        <p className="footer-meta">© {new Date().getFullYear()} {profile.name}
          {profile.sections.footerNote && ` · ${profile.sections.footerNote}`}</p>
      </div>
    </footer>
  );
}
