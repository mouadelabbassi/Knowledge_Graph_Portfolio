import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import gsap from 'gsap';
import type { Position } from '../graph/layout';
import { usePortfolioStore } from '../state/usePortfolioStore';
import { telemetry } from '../debug/telemetry';
import { focusNodeIds } from '../graph/presentation';

export function GraphCamera({ positions, mobile }: { positions: Map<string, Position>; mobile: boolean }) {
  const { camera, gl, invalidate, size } = useThree();
  const selectedId = usePortfolioStore(s => s.selectedId);
  const graphFocusId = usePortfolioStore(s => s.graphFocusId);
  const graphLens = usePortfolioStore(s => s.graphLens);
  const revision = usePortfolioStore(s => s.cameraRevision);
  const command = usePortfolioStore(s => s.cameraCommand);
  const query = usePortfolioStore(s => s.queryResult);
  const replayIndex = usePortfolioStore(s => s.replayIndex);
  const focusId = selectedId ?? (query && replayIndex !== null ? query.steps[replayIndex]?.sourceId ?? null : graphFocusId);
  const focusTargetId = selectedId ? null : query && replayIndex !== null ? query.steps[replayIndex]?.targetId ?? null : null;
  const controls = useMemo(() => new TrackballControls(camera), [camera]);
  const flight = useRef<gsap.core.Timeline | null>(null);
  const stopFlight = () => { flight.current?.kill(); flight.current = null; telemetry.animations.delete('camera'); };

  useEffect(() => {
    controls.connect(gl.domElement);
    controls.rotateSpeed = 1.65;
    controls.zoomSpeed = 1.1;
    controls.panSpeed = .65;
    controls.staticMoving = true;
    controls.multiTouchRoll = true;
    controls.minDistance = 5;
    controls.maxDistance = 90;
    controls.keys = ['', '', ''];
    controls.handleResize();
    const start = () => {
      stopFlight();
      controls.handleResize();
      gl.domElement.classList.add('is-orbiting');
      usePortfolioStore.getState().hover(null);
      invalidate();
    };
    const end = () => { gl.domElement.classList.remove('is-orbiting'); invalidate(); };
    const changed = () => { camera.updateMatrixWorld(); invalidate(); };
    controls.addEventListener('start', start);
    controls.addEventListener('end', end);
    controls.addEventListener('change', changed);
    const move = () => invalidate();
    gl.domElement.addEventListener('pointermove', move);
    gl.domElement.addEventListener('wheel', move);
    return () => {
      stopFlight();
      controls.removeEventListener('start', start);
      controls.removeEventListener('end', end);
      controls.removeEventListener('change', changed);
      gl.domElement.removeEventListener('pointermove', move);
      gl.domElement.removeEventListener('wheel', move);
      controls.dispose();
    };
  }, [controls, gl, camera, invalidate]);

  useFrame(() => { if (!flight.current) controls.update(); }, -3);

  useEffect(() => {
    controls.handleResize();
    let destination: Position = focusId ? positions.get(focusId) ?? [0, 0, 0] : [0, 0, 0];
    const endpoint = focusTargetId ? positions.get(focusTargetId) : undefined;
    if (endpoint) destination = destination.map((v, i) => (v + endpoint[i]!) / 2) as Position;
    const expanded = size.width > 1000 && size.height > 700;
    const baseDistance = mobile ? size.height < 330 ? 15 : 22 : expanded ? 17 : 17.7;
    let distance = baseDistance;
    if (!focusId && mobile) {
      const all = [...positions.values()];
      const halfWidth = Math.max(...all.map(p => Math.abs(p[0]))) + .9;
      const halfHeight = Math.max(...all.map(p => Math.abs(p[1]))) + .9;
      distance = Math.max(baseDistance, Math.max(halfHeight, halfWidth / (size.width / size.height)) / Math.tan(20 * Math.PI / 180) + 2);
    }
    if (focusId && !endpoint) {
      const points = [...focusNodeIds(focusId)].map(id => positions.get(id)).filter((p): p is Position => Boolean(p));
      const minX = Math.min(...points.map(p => p[0])), maxX = Math.max(...points.map(p => p[0]));
      const minY = Math.min(...points.map(p => p[1])), maxY = Math.max(...points.map(p => p[1]));
      destination = [(minX + maxX) / 2, (minY + maxY) / 2, .3];
      const halfHeight = Math.max((maxY - minY) / 2 + 1, ((maxX - minX) / 2 + 1.1) / (size.width / size.height));
      distance = Math.max(baseDistance * .91, halfHeight / Math.tan(20 * Math.PI / 180) + 2);
    }
    stopFlight();
    camera.up.set(0, 1, 0);
    const update = () => { camera.lookAt(controls.target); camera.updateMatrixWorld(); invalidate(); };
    const timeline = gsap.timeline({ onStart: () => telemetry.animations.add('camera'), onUpdate: update,
      onComplete: () => { flight.current = null; telemetry.animations.delete('camera'); invalidate(); } });
    flight.current = timeline;
    timeline.to(camera.position, { x: destination[0], y: destination[1], z: distance, duration: 1.05, ease: 'power3.inOut' }, 0);
    timeline.to(controls.target, { x: destination[0], y: destination[1], z: destination[2] * .4, duration: 1.05, ease: 'power3.inOut' }, 0);
    return stopFlight;
  }, [focusId, focusTargetId, graphLens, revision, mobile, size.height, size.width, positions, camera, controls, invalidate]);

  useEffect(() => {
    if (!command.id) return;
    stopFlight();
    const offset = new Vector3().subVectors(camera.position, controls.target);
    offset.setLength(Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * command.zoom)));
    camera.position.copy(controls.target).add(offset);
    controls.update();
    invalidate();
  }, [command, camera, controls, invalidate]);
  return null;
}
