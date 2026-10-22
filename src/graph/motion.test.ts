import { describe, expect, it } from 'vitest';
import { createFloatingGraph, advanceFloatingGraph, connectionPoint } from './motion';
import type { Position } from './layout';

describe('floating network', () => {
  const base = new Map<string, Position>([['mouad', [0, 0, 1]], ['microgrid', [4, .5, .4]], ['ppo', [-3, 2, -.8]]]);
  it('moves in three dimensions without mutating the settled layout or losing nodes', () => {
    const original = JSON.stringify([...base]);
    const graph = createFloatingGraph(base);
    const initial = [...graph.positions.get('microgrid')!];
    for (let i = 0; i < 600; i++) advanceFloatingGraph(graph, 1 / 60);
    expect(JSON.stringify([...base])).toBe(original);
    expect([...graph.positions.keys()]).toEqual([...base.keys()]);
    expect(graph.positions.get('mouad')).toEqual([0, 0, 2.1]);
    expect(graph.positions.get('microgrid')!.every((v, i) => v !== initial[i])).toBe(true);
    for (const p of graph.particles) p.position.forEach((v, i) => expect(Math.abs(v - p.origin[i]!)).toBeLessThanOrEqual(p.amplitude * (i === 2 ? 4.8 : 2) + 1e-8));
  });
  it('keeps connections attached at both ends while nodes swim', () => {
    const graph = createFloatingGraph(base);
    for (let i = 0; i < 80; i++) advanceFloatingGraph(graph, .05);
    const a = graph.positions.get('microgrid')!, b = graph.positions.get('ppo')!;
    expect(connectionPoint(a, b, 0, false, false)).toEqual(a);
    expect(connectionPoint(a, b, 1, false, false)).toEqual(b);
    expect(connectionPoint(a, b, .5, false, false).every(Number.isFinite)).toBe(true);
  });
  it('caps elapsed frame time after a hidden tab and is deterministic', () => {
    const a = createFloatingGraph(base), b = createFloatingGraph(base);
    advanceFloatingGraph(a, 100); advanceFloatingGraph(b, .05);
    expect(a.time).toBe(.05); expect([...a.positions]).toEqual([...b.positions]);
  });
});
