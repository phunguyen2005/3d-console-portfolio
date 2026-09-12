import { experience, menuItems, profile, projects, toolkit } from '../data/portfolio';
import type { ConsoleState } from '../store/consoleStore';
export function screenDescription(s: ConsoleState): string {
  switch(s.screen){
    case 'boot': return 'Folio OS is starting. Press A to skip.';
    case 'menu': return `Main menu. ${menuItems[s.selection].label} selected. Use arrow keys, Z to open, and X to go back.`;
    case 'about': return `${profile.name}. ${profile.role}. ${profile.location}. ${profile.bio} ${profile.availability}.`;
    case 'projects': return `Selected work. ${s.selection+1} of ${projects.length}. ${projects[s.selection].name}. ${projects[s.selection].description}`;
    case 'project': { const p=projects[s.project];return `${p.name}, ${p.year}, ${p.role}. ${p.description} ${s.selection===0?'View project':'Back'} selected.`; }
    case 'caseStudy': {const p=projects[s.project];return `${p.name}. Page ${s.page+1} of 3. ${[p.description,p.detail,`${p.result} Built with ${p.stack.join(', ')}.`][s.page]}`;}
    case 'toolkit': return `Toolkit, page ${s.page+1} of 2. ${toolkit.slice(s.page*2,s.page*2+2).map(g=>`${g.category}: ${g.items.join(', ')}.`).join(' ')}`;
    case 'experience': return experience.map(e=>`${e.year}: ${e.role}, ${e.company}. ${e.note}`).join(' ');
    case 'contact': return `Say hello to ${profile.name}. Email: ${profile.email}. Phone: ${profile.phone}. GitHub: ${profile.github}. Press A to copy email. ${s.message}`;
    case 'settings': return `Settings. Sound ${s.sound?'on':'off'}. Contrast ${s.contrast?'high':'soft'}. ${['Sound','Contrast','Resume portfolio'][s.selection]} selected. Folio 01 is an original handheld portfolio system for ${profile.name}.`;
  }
}
