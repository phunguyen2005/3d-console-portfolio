import { useEffect, useMemo } from 'react';
import { CanvasTexture, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace } from 'three';

export default function PrintedLabel({
  text,
  width = .8,
  height = .1,
  position = [0, 0, .4],
  color = '#434f3f',
  font,
  rotation = 0,
  letterSpacing,
}: {
  text: string;
  width?: number;
  height?: number;
  position?: [number, number, number];
  color?: string;
  font?: string;
  rotation?: number;
  letterSpacing?: string;
}) {
  const texture = useMemo(() => {
    const aspect = width / Math.max(0.01, height);
    const canvasH = Math.max(128, Math.min(512, Math.round(height * 1600)));
    const canvasW = Math.max(256, Math.min(2048, Math.round(canvasH * aspect)));
    const c = document.createElement('canvas');
    c.width = canvasW;
    c.height = canvasH;
    const ctx = c.getContext('2d', { alpha: true })!;

    let fontFamily = '"DM Mono", monospace';
    let fontWeight = '600';
    if (font) {
      if (font.includes('Arial') || font.includes('Sans') || font.includes('sans-serif')) {
        fontFamily = '"DM Sans", Arial, sans-serif';
      }
      if (font.includes('bold') || font.includes('700') || font.includes('800') || font.includes('900')) {
        fontWeight = 'bold';
      } else if (font.includes('500')) {
        fontWeight = '500';
      }
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (letterSpacing) {
      try { (ctx as unknown as { letterSpacing: string }).letterSpacing = letterSpacing; } catch { /* ignore */ }
    }

    const refSize = 100;
    ctx.font = `${fontWeight} ${refSize}px ${fontFamily}`;
    const measuredWidth = ctx.measureText(text).width || 100;

    const maxFontByHeight = canvasH * 0.74;
    const maxFontByWidth = (canvasW * 0.92 / measuredWidth) * refSize;
    const finalFontSize = Math.max(14, Math.min(maxFontByHeight, maxFontByWidth));

    ctx.font = `${fontWeight} ${Math.round(finalFontSize)}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.fillText(text, canvasW / 2, canvasH / 2);

    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.magFilter = LinearFilter;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, [text, width, height, color, font, letterSpacing]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}
