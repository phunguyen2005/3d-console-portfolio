import { useState } from 'react';
import { experience, menuItems, profile, projects, toolkit, type Section } from '../data/portfolio';
import type { ConsoleController } from '../hooks/useConsoleControls';
import { soundEffects } from '../audio/soundEffects';

export default function TextEdition({ controller, fallback = false }: { controller: ConsoleController; fallback?: boolean }) {
  const [section, setSection] = useState<Section>('about');
  return (
    <section className="text-edition" id="text-edition" tabIndex={-1} aria-label="Portfolio text edition">
      <p className="mono">{fallback ? 'THE TEXT EDITION · SAME LITTLE WORLD' : 'A LITTLE MORE ROOM TO READ'}</p>
      <h2>Phu, outside the screen.</h2>
      <nav className="text-tabs" aria-label="Portfolio sections">
        {menuItems.map(item => (
          <button
            key={item.id}
            aria-pressed={section === item.id}
            onClick={() => {
              soundEffects.tab();
              setSection(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {section === 'about' && (
        <>
          <img className="avatar" src="/pixel-avatar.png" alt="Pixel portrait of Nguyen Do Thanh Phu" />
          <h3>{profile.name}</h3>
          <p className="plain-meta">{profile.role} · {profile.location}</p>
          <p>{profile.bio}</p>
          <p className="plain-meta">{profile.education}</p>
          <p>{profile.availability}.</p>
        </>
      )}
      {section === 'projects' &&
        projects.map((project, i) => (
          <article className="plain-project" key={project.name}>
            <span className="plain-meta">0{i + 1} / {project.year} / {project.category} / {project.role}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <details onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) soundEffects.page(); }}>
              <summary>View project details</summary>
              <p>{project.detail}</p>
              <p>{project.result}</p>
              <p className="plain-meta">Tech Stack: {project.stack.join(' · ')}</p>
            </details>
          </article>
        ))}
      {section === 'toolkit' &&
        toolkit.map(group => (
          <div key={group.category}>
            <h3>{group.category}</h3>
            <p>{group.items.join(' · ')}</p>
          </div>
        ))}
      {section === 'experience' &&
        experience.map(item => (
          <article key={item.year}>
            <span className="plain-meta">{item.year} / {item.company}</span>
            <h3>{item.role}</h3>
            <p>{item.note}</p>
          </article>
        ))}
      {section === 'contact' && (
        <>
          <h3>Good things start with a hello.</h3>
          <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <p>GitHub: <a href={profile.githubUrl} target="_blank" rel="noreferrer">{profile.github}</a></p>
          <p>Phone: {profile.phone}</p>
          <button className="readable-button" onClick={() => void controller.contact()}>Copy email</button>
          <p role="status">{controller.state.message}</p>
        </>
      )}
      <p className="plain-meta">Interactive portfolio of Nguyen Do Thanh Phu, made to be explored.</p>
    </section>
  );
}
