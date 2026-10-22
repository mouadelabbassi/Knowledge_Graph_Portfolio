import { describe, expect, it } from 'vitest';
import { edges, entries, nodes, profile, queryIntents, skills, ui } from '../data/portfolio';
import { createGraphLayout, getGraphLayout } from './layout';
import { telemetry } from '../debug/telemetry';
import { connectionsFor } from './relations';

describe('content integrity and graph contract', () => {
  it('resolves every edge, technology tag, and prepared query result to a unique node', () => {
    const ids = new Set(nodes.map(node => node.id));
    expect(ids.size).toBe(nodes.length);
    for (const edge of edges) { expect(ids.has(edge.source)).toBe(true); expect(ids.has(edge.target)).toBe(true); }
    for (const entry of entries) for (const technology of entry.technologies) expect(ids.has(technology)).toBe(true);
    for (const intent of queryIntents) for (const id of intent.nodes) expect(ids.has(id)).toBe(true);
    expect(new Set(edges.map(edge => edge.id)).size).toBe(edges.length);
  });
  it('does not turn the Leyton knowledge graph into an unsupported Neo4j or GraphRAG claim', () => {
    expect(connectionsFor('leyton').map(connection => connection.node.id)).not.toContain('graphrag');
    expect(nodes.some(node => node.label === 'Neo4j')).toBe(false);
    expect(connectionsFor('ppo').some(connection => connection.node.id === 'microgrid' && connection.edge.relation === 'TRAINED')).toBe(true);
  });
  it('keeps listed skills complete and groups each exactly once', () => {
    const categoryIds = ui.skillCategories.flatMap(category => category.ids);
    expect(new Set(categoryIds).size).toBe(skills.length);
    expect([...categoryIds].sort()).toEqual(skills.map(node => node.id).sort());
  });
  it('produces deterministic, finite, bounded positions without mutating source data', () => {
    const contentBefore = JSON.stringify(nodes);
    const positions = createGraphLayout();
    expect(positions.size).toBe(nodes.length);
    expect([...positions]).toEqual([...createGraphLayout()]);
    for (const position of positions.values()) for (const coordinate of position) {
      expect(Number.isFinite(coordinate)).toBe(true);
      expect(Math.abs(coordinate)).toBeLessThan(9);
    }
    expect(JSON.stringify(nodes)).toBe(contentBefore);
  });
  it('flags machine-written editorial copy and defers translations', () => {
    expect(ui.heroDescription.en.provenance).toBe('machine-written');
    expect(ui.heroDescription.en.reviewed).toBe(false);
    expect(ui.heroDescription.fr).toBeNull();
    expect(ui.heroDescription.ar).toBeNull();
    expect(entries[0]!.summary.en.provenance).toBe('machine-written');
    expect(profile.title.en.provenance).toBe('provided');
  });
  it('preserves Unicode punctuation through content and translation edits', () => {
    expect(ui.heroKicker.en.text).toBe('DATA → KNOWLEDGE → INTELLIGENCE');
    expect(entries[0]!.period).toBe('Jun–Sep 2026');
    expect(entries[0]!.metrics?.[0]?.value).toBe('67.5% → 81.7%');
    expect(JSON.stringify(nodes)).not.toMatch(/\uFFFD|â€|â†|Â·/);
  });
  it('bakes to convergence, stops, and reuses the settled layout on remount', () => {
    const first = getGraphLayout();
    const runs = telemetry.layout.runs;
    expect(getGraphLayout()).toBe(first);
    expect(telemetry.layout.runs).toBe(runs);
    expect(telemetry.layout.alpha).toBeLessThanOrEqual(.001);
    expect(telemetry.layout.maxSpeed).toBeLessThan(.001);
    expect(telemetry.layout.stopped).toBe(true);
  });
});
