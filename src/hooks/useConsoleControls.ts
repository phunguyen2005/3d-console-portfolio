'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { consoleReducer, getSavedSoundPreference, initialState, type Control } from '../store/consoleStore';
import { profile } from '../data/portfolio';
import { soundEffects } from '../audio/soundEffects';

export function useConsoleControls() {
  const [state, dispatch] = useReducer(consoleReducer, initialState);
  const [pressed, setPressed] = useState<Control | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);

    // Initialize saved sound setting
    const savedSound = getSavedSoundPreference();
    if (savedSound) {
      dispatch({ type: 'sound', enabled: true });
      soundEffects.setEnabled(true);
    }

    return () => {
      if (bootTimer.current) clearTimeout(bootTimer.current);
      mq.removeEventListener('change', update);
      if (timer.current) clearTimeout(timer.current);
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, []);

  const powerOn = useCallback(() => {
    if (bootTimer.current || stateRef.current.screen !== 'boot') return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bootTimer.current = setTimeout(() => {
      dispatch({ type: 'ready' });
      soundEffects.boot();
    }, isReduced ? 80 : 1950);
  }, []);

  const toggleSound = useCallback(() => {
    const nextSound = !stateRef.current.sound;
    if (nextSound) {
      soundEffects.setEnabled(true);
      soundEffects.toggleOn();
    } else {
      soundEffects.toggleOff();
      soundEffects.setEnabled(false);
    }
    dispatch({ type: 'sound', enabled: nextSound });
  }, []);

  const contact = useCallback(async () => {
    soundEffects.success();
    try {
      await navigator.clipboard.writeText(profile.email);
      dispatch({ type: 'message', message: 'EMAIL COPIED!' });
    } catch {
      window.location.href = `mailto:${profile.email}`;
      dispatch({ type: 'message', message: 'OPENING MAIL...' });
    }
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => dispatch({ type: 'message', message: '' }), 2500);
  }, []);

  const release = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setPressed(null);
  }, []);

  const press = useCallback((control: Control, hold = false) => {
    setPressed(control);
    const curr = stateRef.current;

    // Sound dispatch based on control and context
    if (control === 'up' || control === 'down' || control === 'left' || control === 'right') {
      if (curr.screen === 'caseStudy' || curr.screen === 'toolkit') {
        soundEffects.page();
      } else {
        soundEffects.move();
      }
    } else if (control === 'a' || control === 'start') {
      if (curr.screen === 'contact') {
        // Will be handled in contact()
      } else if (curr.screen === 'caseStudy' || curr.screen === 'toolkit') {
        soundEffects.page();
      } else if (curr.screen === 'settings' && curr.selection === 0) {
        // Toggling sound option in settings
        if (!curr.sound) {
          soundEffects.setEnabled(true);
          soundEffects.toggleOn();
        } else {
          soundEffects.toggleOff();
          soundEffects.setEnabled(false);
        }
      } else if (curr.screen === 'boot') {
        soundEffects.confirm();
      } else {
        soundEffects.confirm();
      }
    } else if (control === 'b') {
      soundEffects.back();
    } else if (control === 'select') {
      soundEffects.select();
    }

    if (timer.current) clearTimeout(timer.current);
    if (!hold) timer.current = setTimeout(release, 170);
    if ((control === 'a' || control === 'start') && curr.screen === 'contact') void contact();
    dispatch({ type: 'input', control });
  }, [contact, release]);

  const activate = useCallback((index: number) => {
    const curr = stateRef.current;
    if (curr.screen === 'contact') {
      void contact();
    } else if (curr.screen === 'settings' && index === 0) {
      if (!curr.sound) {
        soundEffects.setEnabled(true);
        soundEffects.toggleOn();
      } else {
        soundEffects.toggleOff();
        soundEffects.setEnabled(false);
      }
    } else if (curr.screen === 'caseStudy' || curr.screen === 'toolkit') {
      soundEffects.page();
    } else if (curr.screen === 'project' && index === 1) {
      soundEffects.back();
    } else {
      soundEffects.confirm();
    }
    dispatch({ type: 'activate', index });
  }, [contact]);

  return { state, dispatch, pressed, press, release, activate, reducedMotion, contact, powerOn, toggleSound };
}

export type ConsoleController = ReturnType<typeof useConsoleControls>;
