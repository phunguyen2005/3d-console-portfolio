import { menuItems, projects, type Section } from '../data/portfolio';
export type Control = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start' | 'select';
export type Screen = 'boot' | 'menu' | Section | 'project' | 'caseStudy' | 'settings';
export interface ConsoleState { screen: Screen; selection: number; project: number; page: number; sound: boolean; contrast: boolean; message: string; previous: Screen; previousSelection: number; previousPage: number }
export const initialState: ConsoleState = { screen: 'boot', selection: 0, project: 0, page: 0, sound: true, contrast: false, message: '', previous: 'menu', previousSelection: 0, previousPage: 0 };
export type Action = { type: 'input'; control: Control } | { type: 'ready' } | { type: 'open'; screen: Screen; project?: number } | { type: 'select'; index: number } | { type: 'message'; message: string } | { type: 'sound'; enabled?: boolean } | { type: 'activate'; index: number };
export function getSavedSoundPreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem('console_sound_enabled');
    return saved === null || saved === 'true';
  } catch { return true; }
}
export function itemCount(state: ConsoleState) {
  switch (state.screen) { case 'menu': return menuItems.length; case 'projects': return projects.length; case 'project': return 2; case 'settings': return 3; default: return 1; }
}
function enter(state: ConsoleState): ConsoleState {
  switch (state.screen) {
    case 'boot': return { ...state, screen: 'menu' };
    case 'menu': return { ...state, screen: menuItems[state.selection].id, selection: 0, page: 0, message: '' };
    case 'projects': return { ...state, screen: 'project', project: state.selection, selection: 0, page: 0 };
    case 'project': return state.selection === 0 ? { ...state, screen: 'caseStudy', page: 0 } : back(state);
    case 'caseStudy': return { ...state, page: (state.page + 1) % 3 };
    case 'toolkit': return { ...state, page: (state.page + 1) % 2 };
    case 'settings': {
      if (state.selection === 0) {
        const nextSound = !state.sound;
        if (typeof window !== 'undefined') { try { localStorage.setItem('console_sound_enabled', String(nextSound)); } catch {} }
        return { ...state, sound: nextSound };
      }
      return state.selection === 1 ? { ...state, contrast: !state.contrast } : { ...state, screen: state.previous, selection: state.previousSelection, page: state.previousPage };
    }
    case 'about': case 'experience': return back(state);
    default: return state;
  }
}
function back(state: ConsoleState): ConsoleState {
  if (state.screen === 'settings') return { ...state, screen: state.previous, selection: state.previousSelection, page: state.previousPage };
  if (state.screen === 'caseStudy') return { ...state, screen: 'project', selection: 0, page: 0 };
  if (state.screen === 'project') return { ...state, screen: 'projects', selection: state.project, page: 0 };
  const selected = menuItems.findIndex(item => item.id === state.screen);
  return { ...state, screen: 'menu', selection: Math.max(0, selected), page: 0, message: '' };
}
export function consoleReducer(state: ConsoleState, action: Action): ConsoleState {
  switch (action.type) {
    case 'ready': return state.screen === 'boot' ? { ...state, screen: 'menu' } : state;
    case 'sound': {
      const nextSound = action.enabled !== undefined ? action.enabled : !state.sound;
      if (typeof window !== 'undefined') { try { localStorage.setItem('console_sound_enabled', String(nextSound)); } catch {} }
      return { ...state, sound: nextSound };
    }
    case 'message': return { ...state, message: action.message };
    case 'open': return { ...state, screen: action.screen, project: action.project ?? state.project, selection: 0, page: 0, message: '' };
    case 'select': return { ...state, selection: Math.max(0, Math.min(itemCount(state) - 1, action.index)) };
    case 'activate': return enter({ ...state, selection: Math.max(0, Math.min(itemCount(state) - 1, action.index)) });
    case 'input': {
      const { control } = action;
      if (control === 'select') return state.screen === 'settings' ? back(state) : { ...state, screen: 'settings', previous: state.screen === 'boot' ? 'menu' : state.screen, previousSelection: state.selection, previousPage: state.page, selection: 0 };
      if (control === 'b') return back(state);
      if (control === 'a' || control === 'start') return enter(state);
      const delta = control === 'up' || control === 'left' ? -1 : 1;
      if (state.screen === 'caseStudy' || state.screen === 'toolkit') return { ...state, page: (state.page + delta + (state.screen === 'toolkit' ? 2 : 3)) % (state.screen === 'toolkit' ? 2 : 3) };
      const count = itemCount(state);
      return { ...state, selection: (state.selection + delta + count) % count };
    }
  }
}
