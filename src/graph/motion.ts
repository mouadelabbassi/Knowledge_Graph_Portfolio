import type { Position } from './layout';

export interface FloatingNode { origin: Position; position: Position; phase: number; amplitude: number }
export function createFloatingGraph(base: Map<string, Position>) {
  const positions = new Map<string, Position>();
  const particles: FloatingNode[] = [];
  for (const [id, point] of base) {
    const origin: Position = [point[0], point[1], point[2] * 2.1];
    const position: Position = [...origin];
    positions.set(id, position);
    let seed = 0;
    for (const char of id) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
    const fixed = ['mouad', 'projects', 'experience', 'skills', 'certifications', 'education'].includes(id);
    particles.push({ origin, position, phase: seed % 628 / 100, amplitude: fixed ? 0 : .12 + seed % 13 / 100 });
  }
  return { positions, particles, time: 0, revision: 0 };
}
export type FloatingGraph = ReturnType<typeof createFloatingGraph>;

// Bounded swimming around the settled layout; content and topology stay immutable.
export function advanceFloatingGraph(graph: FloatingGraph, delta: number) {
  graph.time += Math.min(Math.max(delta, 0), .05);
  for (const { origin, position, phase, amplitude } of graph.particles) {
    const t = graph.time;
    position[0] = origin[0] + (Math.sin(t * .34 + phase) - Math.sin(phase)) * amplitude;
    position[1] = origin[1] + (Math.cos(t * .28 + phase) - Math.cos(phase)) * amplitude;
    position[2] = origin[2] + (Math.sin(t * .22 + phase) - Math.sin(phase)) * amplitude * 2.4;
  }
  graph.revision++;
}

export function connectionPoint(source: Position, target: Position, t: number, navigation: boolean, central: boolean): Position {
  let cx = (source[0] + target[0]) / 2, cy = (source[1] + target[1]) / 2;
  const cz = (source[2] + target[2]) / 2 + (navigation ? .45 : .2) + (central ? .3 : 0);
  if (central) { cx *= 1.2; cy *= 1.2; }
  const a = (1 - t) ** 2, b = 2 * (1 - t) * t, c = t * t;
  return [a * source[0] + b * cx + c * target[0], a * source[1] + b * cy + c * target[1], a * source[2] + b * cz + c * target[2]];
}
