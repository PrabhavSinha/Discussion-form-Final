import { describe, it, expect, vi } from 'vitest';
import {
  formatRelativeTime,
  buildPostTree,
  truncate,
  formatCount,
  parseTags,
  generateId,
} from '../utils/index.js';

// ─── formatRelativeTime ────────────────────────────────────────────────────
describe('formatRelativeTime', () => {
  it('returns "just now" for very recent times', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatRelativeTime(recent)).toBe('just now');
  });

  it('returns minutes for times < 1 hour ago', () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(formatRelativeTime(tenMinAgo)).toBe('10m ago');
  });

  it('returns hours for times < 1 day ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
  });

  it('returns days for times < 1 month ago', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveDaysAgo)).toBe('5d ago');
  });
});

// ─── buildPostTree ────────────────────────────────────────────────────────
describe('buildPostTree', () => {
  it('builds a flat list of root posts', () => {
    const posts = [
      { id: 'p1', parentId: null, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'p2', parentId: null, createdAt: '2024-01-01T11:00:00Z' },
    ];
    const tree = buildPostTree(posts);
    expect(tree).toHaveLength(2);
    expect(tree[0].children).toHaveLength(0);
  });

  it('nests children under parents', () => {
    const posts = [
      { id: 'p1', parentId: null, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'p2', parentId: 'p1', createdAt: '2024-01-01T11:00:00Z' },
      { id: 'p3', parentId: 'p1', createdAt: '2024-01-01T12:00:00Z' },
    ];
    const tree = buildPostTree(posts);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(2);
  });

  it('handles orphaned posts by putting them in root', () => {
    const posts = [
      { id: 'p1', parentId: 'nonexistent', createdAt: '2024-01-01T10:00:00Z' },
    ];
    const tree = buildPostTree(posts);
    expect(tree).toHaveLength(1);
  });

  it('sorts children chronologically', () => {
    const posts = [
      { id: 'p1', parentId: null, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'p3', parentId: 'p1', createdAt: '2024-01-01T13:00:00Z' },
      { id: 'p2', parentId: 'p1', createdAt: '2024-01-01T11:00:00Z' },
    ];
    const tree = buildPostTree(posts);
    expect(tree[0].children[0].id).toBe('p2');
    expect(tree[0].children[1].id).toBe('p3');
  });
});

// ─── truncate ─────────────────────────────────────────────────────────────
describe('truncate', () => {
  it('returns the string unchanged if under maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ellipsis when over maxLength', () => {
    const result = truncate('hello world', 5);
    expect(result).toMatch(/…$/);
    expect(result.length).toBeLessThanOrEqual(6);
  });

  it('uses default maxLength of 150', () => {
    const long = 'a'.repeat(200);
    const result = truncate(long);
    expect(result.length).toBeLessThanOrEqual(152);
  });
});

// ─── formatCount ──────────────────────────────────────────────────────────
describe('formatCount', () => {
  it('returns plain number for < 1000', () => {
    expect(formatCount(999)).toBe('999');
  });

  it('returns formatted k for >= 1000', () => {
    expect(formatCount(1200)).toBe('1.2k');
    expect(formatCount(10000)).toBe('10.0k');
  });
});

// ─── parseTags ─────────────────────────────────────────────────────────────
describe('parseTags', () => {
  it('splits by comma and trims', () => {
    const tags = parseTags('react, vue , angular');
    expect(tags).toEqual(['react', 'vue', 'angular']);
  });

  it('converts spaces to hyphens', () => {
    const tags = parseTags('hello world');
    expect(tags).toContain('hello-world');
  });

  it('limits to 5 tags', () => {
    const tags = parseTags('a,b,c,d,e,f,g');
    expect(tags).toHaveLength(5);
  });

  it('filters empty strings', () => {
    const tags = parseTags('a,,b,,c');
    expect(tags).toEqual(['a', 'b', 'c']);
  });
});

// ─── generateId ───────────────────────────────────────────────────────────
describe('generateId', () => {
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('includes prefix when provided', () => {
    const id = generateId('thread-');
    expect(id.startsWith('thread-')).toBe(true);
  });
});
