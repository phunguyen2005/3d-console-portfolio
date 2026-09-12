'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { consoleReducer, initialState, type Control } from '../store/consoleStore';
import { profile } from '../data/portfolio';
export function useConsoleControls() {
  const [state, dispatch] = useReducer(consoleReducer, initialState);
  const [pressed, setPressed] = useState<Control | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const bootTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state); stateRef.current = state;
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches); update(); mq.addEventListener('change', update);
    return () => { if(bootTimer.current) clearTimeout(bootTimer.current); mq.removeEventListener('change', update); if (timer.current) clearTimeout(timer.current); if (messageTimer.current) clearTimeout(messageTimer.current); void audio.current?.close(); };
  }, []);
  const powerOn = useCallback(() => {
    if(bootTimer.current || stateRef.current.screen!=='boot') return;
    bootTimer.current=setTimeout(()=>dispatch({type:'ready'}),window.matchMedia('(prefers-reduced-motion: reduce)').matches?80:1950);
  },[]);
  const clickSound = useCallback(() => {
    if (!stateRef.current.sound) return;
    try {
      const context = audio.current ?? (audio.current = new AudioContext());
      if (context.state === 'suspended') void context.resume();
      const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(190, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(75, context.currentTime + .025);
      gain.gain.setValueAtTime(.055, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .035);
      oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .04);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    } catch { /* Sound is optional when audio is unavailable. */ }
  }, []);
  const contact = useCallback(async () => {
    try { await navigator.clipboard.writeText(profile.email); dispatch({ type: 'message', message: 'EMAIL COPIED!' }); }
    catch { window.location.href = `mailto:${profile.email}`; dispatch({ type: 'message', message: 'OPENING MAIL...' }); }
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => dispatch({ type: 'message', message: '' }), 2500);
  }, []);
  const release = useCallback(() => { if(timer.current)clearTimeout(timer.current); setPressed(null); }, []);
  const press = useCallback((control: Control, hold = false) => {
    setPressed(control); clickSound();
    if (timer.current) clearTimeout(timer.current);
    if(!hold) timer.current = setTimeout(release, 170);
    if ((control === 'a' || control === 'start') && stateRef.current.screen === 'contact') void contact();
    dispatch({ type: 'input', control });
  }, [clickSound, contact, release]);
  const activate = useCallback((index: number) => {
    clickSound();
    if (stateRef.current.screen === 'contact') void contact();
    dispatch({ type: 'activate', index });
  }, [clickSound, contact]);
  return { state, dispatch, pressed, press, release, activate, reducedMotion, contact, powerOn };
}
export type ConsoleController = ReturnType<typeof useConsoleControls>;
