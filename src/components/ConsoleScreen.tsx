import { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { CanvasTexture, NearestFilter, SRGBColorSpace, type ShaderMaterial } from 'three';
import { gsap } from 'gsap';
import { getHitAreas, LCD_HEIGHT, LCD_WIDTH, renderScreen } from '../screens/renderScreen';
import type { ConsoleController } from '../hooks/useConsoleControls';
import { screenDescription } from '../screens/screenDescription';

export default function ConsoleScreen({ controller }: { controller: ConsoleController }) {
  const { state, reducedMotion } = controller;
  const { invalidate } = useThree();
  const [avatar, setAvatar] = useState<HTMLImageElement | null>(null);
  const material = useRef<ShaderMaterial>(null);
  const lastWheel = useRef(0);

  useEffect(() => {
    controller.powerOn();
  }, [controller]);

  const [surface, ghost, texture, ghostTexture, uniforms] = useMemo(() => {
    const surface = document.createElement('canvas');
    surface.width = LCD_WIDTH;
    surface.height = LCD_HEIGHT;
    const ghost = surface.cloneNode() as HTMLCanvasElement;
    const texture = new CanvasTexture(surface);
    const ghostTexture = new CanvasTexture(ghost);
    [texture, ghostTexture].forEach((t) => {
      t.minFilter = NearestFilter;
      t.magFilter = NearestFilter;
      t.generateMipmaps = false;
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 16;
    });
    const uniforms = {
      map: { value: texture },
      previous: { value: ghostTexture },
      persistence: { value: 0 },
    };
    return [surface, ghost, texture, ghostTexture, uniforms] as const;
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setAvatar(img);
    img.src = '/pixel-avatar.png';
    return () => {
      img.onload = null;
    };
  }, []);

  useEffect(() => {
    ghost.getContext('2d')!.drawImage(surface, 0, 0);
    ghostTexture.needsUpdate = true;
    renderScreen(surface, state, avatar);
    texture.needsUpdate = true;
    invalidate();

    if (!reducedMotion && state.screen !== 'boot') {
      uniforms.persistence.value = 0.25;
      const tween = gsap.to(uniforms.persistence, {
        value: 0,
        duration: 0.22,
        ease: 'power2.out',
        onUpdate: invalidate,
      });
      return () => {
        tween.kill();
      };
    }
  }, [state, avatar, reducedMotion, surface, ghost, texture, ghostTexture, uniforms, invalidate]);

  useEffect(() => {
    if (state.screen !== 'boot' || reducedMotion) return;
    const progress = { value: 0 };
    const tween = gsap.to(progress, {
      value: 1,
      duration: 1.85,
      ease: 'none',
      onUpdate: () => {
        renderScreen(surface, state, avatar, progress.value);
        texture.needsUpdate = true;
        invalidate();
      },
    });
    return () => {
      tween.kill();
    };
  }, [state, reducedMotion, avatar, surface, texture, invalidate]);

  useEffect(() => {
    return () => {
      texture.dispose();
      ghostTexture.dispose();
    };
  }, [texture, ghostTexture]);

  return (
    <group position={[0.08, 1.06, 0.432]}>
      <mesh>
        <planeGeometry args={[2.69, 2.33]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={
            'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'
          }
          fragmentShader={
            'uniform sampler2D map;uniform sampler2D previous;uniform float persistence;varying vec2 vUv;void main(){vec3 c=mix(texture2D(map,vUv).rgb,texture2D(previous,vUv).rgb,persistence);vec2 p=fract(vUv*vec2(240.,208.));float grid=1.-.035*(step(.93,p.x)+step(.93,p.y));float reflection=.005*pow(max(0.,vUv.y-vUv.x*.35),2.);gl_FragColor=vec4(c*grid+reflection,1.);\n#include <colorspace_fragment>\n}'
          }
        />
      </mesh>
      <Html transform position={[0, 0, 0.012]} scale={0.4483} zIndexRange={[8, 1]}>
        <div
          className="lcd-hit-layer"
          aria-label={`Console screen: ${state.screen}`}
          data-screen={state.screen}
          data-selection={state.selection}
          data-project={state.project}
          data-page={state.page}
          onWheel={(event) => {
            if (state.screen !== 'projects') return;
            event.stopPropagation();
            if (Date.now() - lastWheel.current < 180) return;
            lastWheel.current = Date.now();
            controller.press(event.deltaY > 0 ? 'down' : 'up');
          }}
        >
          <span className="lcd-accessible-name" role="status" aria-live="polite">
            {screenDescription(state)}
          </span>
          {getHitAreas(state).map((hit) => (
            <button
              className="lcd-hit"
              key={hit.label}
              aria-label={hit.label}
              style={{ left: hit.x, top: hit.y, width: hit.width, height: hit.height }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                if (hit.back) controller.press('b');
                else controller.activate(hit.index);
              }}
            />
          ))}
        </div>
      </Html>
    </group>
  );
}
