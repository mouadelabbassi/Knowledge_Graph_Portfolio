import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { debugEnabled, recordWork, startProfile, telemetry } from './telemetry';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { queryIntents } from '../data/portfolio';
import { copy } from '../types/portfolio';

export function SceneTelemetry() {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    if (!debugEnabled) return;
    const original = gl.render;
    gl.render = (...args: Parameters<typeof gl.render>) => {
      const start = performance.now();
      original.apply(gl, args);
      telemetry.frames++;
      telemetry.calls = gl.info.render.calls;
      telemetry.peakCalls = Math.max(telemetry.peakCalls,telemetry.calls);
      telemetry.triangles = gl.info.render.triangles;
      telemetry.dpr = gl.getPixelRatio();
      recordWork('render', start);
    };
    const context = gl.getContext();
    const extension = context.getExtension('WEBGL_debug_renderer_info');
    telemetry.renderer = String(context.getParameter(extension ? extension.UNMASKED_RENDERER_WEBGL : context.RENDERER));
    const start = () => invalidate();
    window.addEventListener('portfolio:profile-start', start);
    const params = new URLSearchParams(window.location.search);
    const timer = params.get('autoprofile') === '1' ? setTimeout(() => {
      startProfile(params.get('profile') ?? 'manual');
      if(params.get('profile')?.startsWith('m2-')) {
        usePortfolioStore.getState().ask(copy(queryIntents.find(intent=>intent.id==='rag')!.question));
        usePortfolioStore.getState().startReplay(true);
      }
    }, 1800) : undefined;
    return () => { gl.render = original; window.removeEventListener('portfolio:profile-start', start); clearTimeout(timer); };
  }, [gl, invalidate]);
  useFrame(() => { if (telemetry.profileDeadline > performance.now()) invalidate(); });
  return null;
}
