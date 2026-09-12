import { text, wrap } from './pixelFont';
import { experience, menuItems, profile, projects, toolkit } from '../data/portfolio';
import type { ConsoleState } from '../store/consoleStore';
export const LCD_WIDTH = 240, LCD_HEIGHT = 208;
export interface HitArea { label: string; x: number; y: number; width: number; height: number; index: number; back?: boolean }
export function getHitAreas(state: ConsoleState): HitArea[] {
  if (state.screen === 'boot') return [{label:'Start portfolio', x:0,y:0,width:240,height:208,index:0}];
  if (state.screen === 'menu') return menuItems.map((item,index) => ({label:item.label,x:10,y:83+index*21,width:220,height:21,index}));
  if (state.screen === 'projects') return projects.map((item,index) => ({label:item.name,x:10,y:44+index*32,width:220,height:30,index}));
  if (state.screen === 'project') return [{label:'View project',x:10,y:154,width:220,height:20,index:0},{label:'Back to selected work',x:10,y:176,width:220,height:19,index:1}];
  if (state.screen === 'settings') return [state.sound?'Sound on':'Sound off',state.contrast?'Contrast high':'Contrast soft','Resume portfolio'].map((label,index) => ({label,x:10,y:59+index*27,width:220,height:25,index}));
  return [{label:state.screen==='contact'?'Copy email':state.screen==='toolkit'||state.screen==='caseStudy'?'Next page':'Back to main menu',x:8,y:155,width:224,height:45,index:0,back:!['contact','toolkit','caseStudy'].includes(state.screen)}];
}
export function renderScreen(canvas: HTMLCanvasElement, state: ConsoleState, avatar: HTMLImageElement | null, bootProgress = 1) {
  const ctx = canvas.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  const bg=state.contrast?'#c5d486':'#b4c278', ink=state.contrast?'#192b18':'#293b22', muted='#617546';
  ctx.fillStyle=bg;ctx.fillRect(0,0,LCD_WIDTH,LCD_HEIGHT);
  const print=(s:string,x:number,y:number,scale=1,color=ink)=>text(ctx,s,x,y,scale,color);
  const line=(y:number)=>{ctx.fillStyle=muted;ctx.globalAlpha=.45;ctx.fillRect(10,y,220,1);ctx.globalAlpha=1;};
  const title=(name:string,num:string)=>{print(name,11,11);print(num,198,11);line(24);};
  const foot=(message='B BACK',right='A OPEN')=>{line(194);print(message,11,199,1,muted);print(right,164,199,1,muted);};
  const row=(name:string,y:number,index:number,number?:string,height=20)=>{const selected=state.selection===index;if(selected){ctx.fillStyle=ink;ctx.fillRect(9,y-5,222,height);}print(selected?'>':' ',15,y,1,selected?bg:ink);print(name,27,y,1,selected?bg:ink);if(number)print(number,211,y,1,selected?bg:muted);};
  const portrait=(x:number,y:number,size:number)=>{if(avatar){ctx.drawImage(avatar,x,y,size,size);const pixels=ctx.getImageData(x,y,size,size);const palette=[[41,59,34],[97,117,70],[147,165,91],[180,194,120]];for(let i=0;i<pixels.data.length;i+=4){const brightness=(pixels.data[i]*.3+pixels.data[i+1]*.6+pixels.data[i+2]*.1)/255;const c=palette[Math.min(3,Math.floor(brightness*4))];pixels.data[i]=c[0];pixels.data[i+1]=c[1];pixels.data[i+2]=c[2];}ctx.putImageData(pixels,x,y);}};
  if(state.screen==='boot'){
    if(bootProgress<.13){ctx.fillStyle='#cbd793';ctx.fillRect(0,0,240,208);return;}
    print('FOLIO',63,52,3);print('POCKET OS / SYSTEM 01',58,87);print(bootProgress>.83?'READY.':'LOADING...',91,132);
    ctx.strokeStyle=ink;ctx.strokeRect(57,110,126,10);ctx.fillStyle=ink;ctx.fillRect(60,113,Math.floor(bootProgress*120),4);print('A LITTLE WORLD AWAITS.',61,172);return;
  }
  switch(state.screen){
    case 'menu':
      title('PLAYER 01','01/05');portrait(10,31,43);print('PHU',62,34,2);print('NGUYEN.',62,52,2);print('FULL-STACK DEVELOPER',62,71);
      menuItems.forEach((item,i)=>row(item.label,90+i*21,i,`0${i+1}`));foot('MADE TO BE EXPLORED','A OPEN');break;
    case 'about':
      title('ABOUT ME','01');portrait(12,34,57);print('PHU NGUYEN',78,38);print('FULL-STACK',78,52);print('DEVELOPER',78,64);print(profile.shortLocation,78,78);print('HCMUE · IT 2027',78,90,1,muted);line(103);
      profile.shortBio.forEach((s,i)=>print(s,12,116+i*13));ctx.fillStyle=ink;ctx.fillRect(12,169,4,4);print('OPEN TO FULL-STACK ROLES',23,168);foot('B BACK','A / B BACK');break;
    case 'projects':
      title('SELECTED WORK','02');print('FOUR LITTLE WORLDS.',12,33,1,muted);
      projects.forEach((p,i)=>{row(`0${i+1} / ${p.shortName}`,52+i*32,i,undefined,14);print(`${p.year} / ${p.category}`,27,64+i*32,1,muted);});foot();break;
    case 'project':{
      const p=projects[state.project];title(`PROJECT 0${state.project+1}`,p.year);print(p.shortName,12,34,2);print(p.role,12,57,1,muted);
      ctx.strokeStyle=ink;ctx.strokeRect(12,72,215,36);ctx.fillStyle=muted;ctx.fillRect(16,76,58,28);ctx.fillStyle=ink;for(let i=0;i<3;i++)ctx.fillRect(80+i*47,78,40,3);ctx.fillRect(81,86,108,2);ctx.fillRect(81,92,135,2);ctx.fillRect(81,98,89,2);
      p.short.forEach((s,i)=>print(s,12,118+i*11));row('VIEW PROJECT',158,0);row('BACK',178,1);foot();break;}
    case 'caseStudy':{
      const p=projects[state.project];title(p.shortName,`${state.page+1}/3`);
      print(['THE IDEA','THE PROCESS','THE OUTCOME'][state.page],12,38,1,muted);
      const description=[p.description,p.detail,p.result][state.page];wrap(description,35).slice(0,8).forEach((s,i)=>print(s,12,56+i*12));
      if(state.page===2){print('BUILT WITH',12,148,1,muted);print(p.stack.join(' / '),12,161);}print('> NEXT PAGE',12,180);foot('B PROJECT','A NEXT');break;}
    case 'toolkit':
      title('MY TOOLKIT',`${state.page+1}/2`);toolkit.slice(state.page*2,state.page*2+2).forEach((group,g)=>{const top=37+g*66;print(group.category,12,top,1,muted);group.items.forEach((s,i)=>{ctx.strokeStyle=ink;ctx.strokeRect(12,top+14+i*10,4,4);print(s,23,top+13+i*10);});});print('> MORE TOOLS',12,179);foot('B BACK','A NEXT');break;
    case 'experience':
      title('EXPERIENCE','04');line(24);ctx.fillStyle=muted;ctx.fillRect(15,36,1,140);
      experience.forEach((item,i)=>{const y=35+i*38;ctx.fillStyle=ink;ctx.fillRect(12,y,7,7);print(item.year,26,y);print(item.role.toUpperCase(),64,y);print(item.company.toUpperCase(),26,y+11,1,muted);});foot('B BACK','A / B BACK');break;
    case 'contact':
      title('SAY HELLO','05');print('NGUYEN DO THANH PHU',12,36,1);print('FULL-STACK DEVELOPER',12,48,1,muted);line(60);
      print('HO CHI MINH CITY, VN',12,71);print('TEL 0852852018',12,84);print(profile.email,12,98);print(profile.github,12,112);
      print('READY TO BUILD REAL-WORLD',12,130,1,muted);print('FULL-STACK WEB PRODUCTS.',12,142,1,muted);
      ctx.fillStyle=ink;ctx.fillRect(18,158,204,24);print(state.message||'A COPY EMAIL',state.message?58:72,167,1,bg);foot('B BACK','A COPY');break;
    case 'settings':
      title('SYSTEM OPTIONS','SYS');print('MAKE YOURSELF AT HOME.',12,38,1,muted);row(`SOUND ${state.sound?'ON':'OFF'}`,66,0);row(`CONTRAST ${state.contrast?'HIGH':'SOFT'}`,93,1);row('RESUME PORTFOLIO',120,2);print('FOLIO / 01 POCKET SYSTEM',12,154);print('NGUYEN DO THANH PHU',12,168,1,muted);print('INTERACTIVE PORTFOLIO · 2026',12,180,1,muted);foot('B RESUME','A SELECT');break;
  }
  // A restrained edge falloff is baked into the LCD, beneath its physical glass.
  const vignette=ctx.createRadialGradient(120,100,65,120,100,157);vignette.addColorStop(0,'#293b2200');vignette.addColorStop(1,'#293b2234');ctx.fillStyle=vignette;ctx.fillRect(0,0,240,208);
}
