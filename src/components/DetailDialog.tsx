import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { experienceById } from '../data/experience';
import { projectById } from '../data/projects';
import type { Highlight } from '../data/types';
import type { DetailTarget } from './DetailContext';
import './DetailDialog.css';

interface Props {
  target: DetailTarget | null;
  onClose: () => void;
}

/**
 * One reusable, native <dialog> for every project and experience entry.
 * showModal() gives us the top layer, an inert background, and Escape handling;
 * we add focus restoration, scroll locking, and backdrop-click close.
 */
export default function DetailDialog({ target, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (target) {
      if (!dlg.open) {
        returnFocus.current = document.activeElement as HTMLElement | null;
        document.documentElement.classList.add('modal-open');
        dlg.showModal();
      }
      bodyRef.current?.scrollTo({ top: 0 });
      headingRef.current?.focus({ preventScroll: true });
    } else if (dlg.open) {
      dlg.close();
    }
  }, [target]);

  const handleClose = () => {
    document.documentElement.classList.remove('modal-open');
    onClose();
    const el = returnFocus.current;
    returnFocus.current = null;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
  };

  const content = target ? toContent(target) : null;

  return (
    <dialog
      ref={ref}
      className="detail"
      aria-labelledby="detail-title"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="detail-body" ref={bodyRef}>
        <div className="detail-bar">
          <button type="button" className="detail-close" aria-label="Close" onClick={() => ref.current?.close()}>
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        {content && (
          <article>
            <header className="d-header">
              <p className="d-meta">{content.meta}</p>
              <h2 id="detail-title" ref={headingRef} tabIndex={-1}>
                {content.title}
              </h2>
              {content.subtitle && <p className="d-subtitle">{content.subtitle}</p>}
            </header>

            <p className="d-text">{content.text}</p>

            {content.highlights?.length ? (
              <dl className="d-highlights">
                {content.highlights.map((h, i) => (
                  <div key={i} className={h.value ? '' : 'no-value'}>
                    {h.value && <dt>{h.value}</dt>}
                    <dd>{h.text}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {content.note && <p className="d-note">{content.note}</p>}

            {(content.tech || content.links.length > 0) && (
              <footer className="d-footer">
                {content.tech && <p className="d-tech">{content.tech}</p>}
                {content.links.length > 0 && (
                  <ul className="text-links">
                    {content.links.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer">
                          {l.label}
                          <ArrowUpRight size={14} aria-hidden="true" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </footer>
            )}
          </article>
        )}
      </div>
    </dialog>
  );
}

interface Content {
  meta: string;
  title: string;
  subtitle?: string;
  text: string;
  highlights?: Highlight[];
  note?: string;
  tech?: string;
  links: { label: string; url: string }[];
}

function toContent(t: DetailTarget): Content | null {
  if (t.kind === 'project') {
    const p = projectById(t.id);
    if (!p) return null;
    return {
      meta: [p.institution ?? p.role, p.dates, p.status === 'In development' ? 'In development' : null].filter(Boolean).join(' · '),
      title: p.title,
      subtitle: p.subtitle,
      text: p.overview,
      highlights: p.highlights,
      note: p.note,
      tech: p.technologies.join(' · '),
      links: [
        p.demoUrl && { label: 'Demo', url: p.demoUrl },
        p.githubUrl && { label: 'Source', url: p.githubUrl },
        p.paperUrl && { label: 'Paper', url: p.paperUrl },
      ].filter(Boolean) as Content['links'],
    };
  }
  const e = experienceById(t.id);
  if (!e) return null;
  return {
    meta: e.dates,
    title: e.role,
    subtitle: [e.organization, e.unit].filter(Boolean).join(' — '),
    text: e.summary,
    highlights: e.highlights,
    note: e.note,
    links: [],
  };
}
