import { ArrowUpRight, FileText, Mail } from 'lucide-react';
import { profile, withBase } from '../data/profile';
import HeroMap from './maps/HeroMap';

export default function Hero() {
  const { links } = profile;
  return (
    <section id="top" className="hero" aria-labelledby="hero-name">
      <div className="hero-map-band" aria-hidden="true">
        <HeroMap fill />
      </div>
      <div className="container container--wide hero-inner">
        <div className="hero-copy">
          <div className="hero-lede">
            <h1 id="hero-name" className="hero-name">
              {profile.name}
              <span className="accent-mark">.</span>
            </h1>
            <p className="hero-headline">{profile.headline}</p>
          </div>
          <div className="hero-side">
            <p className="hero-intro">{profile.intro}</p>
            <ul className="text-links hero-links">
              {links.linkedin && (
                <li>
                  <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )}
              {links.github && (
                <li>
                  <a href={links.github} target="_blank" rel="noopener noreferrer">
                    GitHub <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${links.email}`}>
                  <Mail size={14} aria-hidden="true" /> {links.email}
                </a>
              </li>
              {links.resume && (
                <li>
                  <a href={withBase(links.resume)} target="_blank" rel="noopener noreferrer">
                    <FileText size={14} aria-hidden="true" /> Résumé
                    <span className="sr-only">(PDF, opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
