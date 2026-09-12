'use client';
import { lazy, Suspense, useState, useEffect } from 'react';
import EditorialText from './EditorialText';
import Instructions from './Instructions';
import { useConsoleControls } from '../hooks/useConsoleControls';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import TextEdition from './TextEdition';
import { soundEffects } from '../audio/soundEffects';

const Console3D = lazy(() => import('./Console3D'));

export default function HeroLayout() {
  const controller = useConsoleControls();
  const [textEdition, setTextEdition] = useState(false);

  useEffect(() => {
    const handleGesture = () => soundEffects.unlock();
    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  useEffect(() => {
    if (textEdition) {
      const panel = document.getElementById('text-edition');
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({
        behavior: controller.reducedMotion ? 'instant' : 'smooth',
        block: 'start',
      });
    }
  }, [textEdition, controller.reducedMotion]);

  useKeyboardControls(controller.press, controller.release);

  return (
    <div className="site">
      <a className="sr-only skip-link" href="#portfolio">Skip to portfolio</a>
      <header className="masthead">
        <div className="wordmark">
          <span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>
          folio.
        </div>
        <span className="masthead-caption mono">AN INTERACTIVE PORTFOLIO</span>
        <span className="availability mono"><i className="status-dot" />OPEN TO FULL-STACK ROLES</span>
      </header>
      <main id="portfolio">
        <div className="hero">
          <EditorialText />
          <section className="console-stage" aria-label="Interactive Folio 01 handheld portfolio">
            <div className="stage-caption mono">LESS SCROLL. MORE PLAY.</div>
            <Suspense fallback={<div className="scene-loading" role="status">POWERING ON…</div>}>
              <Console3D controller={controller} />
            </Suspense>
            <div className="stage-hint mono">
              <span aria-hidden="true">↔</span>DRAG TO EXPLORE<span>·</span>TAP TO PLAY
            </div>
          </section>
          <Instructions onSettings={() => controller.press('select')} />
        </div>
        {textEdition && <TextEdition controller={controller} />}
      </main>
      <footer className="footer mono">
        <span>© 2026 NGUYEN DO THANH PHU</span>
        <span className="footer-center">HO CHI MINH CITY · VIETNAM</span>
        <div className="footer-actions">
          <button
            className="text-link"
            aria-expanded={textEdition}
            onClick={() => {
              soundEffects.tab();
              setTextEdition(v => !v);
            }}
          >
            {textEdition ? 'Close text edition' : 'Text edition'} ↗
          </button>
          <button
            className={`text-link sound-toggle ${controller.state.sound ? 'sound-active' : ''}`}
            aria-pressed={controller.state.sound}
            onClick={controller.toggleSound}
          >
            <span aria-hidden="true">{controller.state.sound ? '🔊 ♪' : '🔈 ♩'}</span>
            SOUND {controller.state.sound ? 'ON' : 'OFF'}
          </button>
        </div>
      </footer>
    </div>
  );
}
