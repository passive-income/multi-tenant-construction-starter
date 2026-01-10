/**
 * Unit tests for normalizeImageSrc utility.
 *
 * To run these tests:
 * 1. Run: `pnpm test`
 */

import { describe, expect, it, vi } from 'vitest';
import { normalizeImageSrc } from './image';

// Mock the Sanity image builder
vi.mock('@/sanity/lib/image', () => ({
  urlFor: vi.fn((_src: any) => ({
    width: vi.fn(function () {
      return this;
    }),
    auto: vi.fn(function () {
      return this;
    }),
    url: vi.fn(() => 'https://cdn.sanity.io/images/mocked.jpg'),
  })),
}));

describe('normalizeImageSrc', () => {
  it('should return null for empty string', () => {
    expect(normalizeImageSrc('')).toBeNull();
  });

  it('should return null for whitespace-only string', () => {
    expect(normalizeImageSrc('   ')).toBeNull();
  });

  it('should return null for null input', () => {
    expect(normalizeImageSrc(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(normalizeImageSrc(undefined)).toBeNull();
  });

  it('should return trimmed string for valid URL', () => {
    const url = '  https://example.com/image.jpg  ';
    expect(normalizeImageSrc(url)).toBe('https://example.com/image.jpg');
  });

  it('should return null for non-string, non-object input', () => {
    expect(normalizeImageSrc(123 as any)).toBeNull();
    expect(normalizeImageSrc(true as any)).toBeNull();
  });

  it('should handle Sanity image object with width option', () => {
    const sanityImage = {
      _type: 'image',
      asset: {
        _ref: 'image-abc123',
      },
    };
    const result = normalizeImageSrc(sanityImage, { width: 800 });
    expect(result).toBe('https://cdn.sanity.io/images/mocked.jpg');
  });

  it('should handle Sanity image object with autoFormat option', () => {
    const sanityImage = {
      _type: 'image',
      asset: {
        _ref: 'image-abc123',
      },
    };
    const result = normalizeImageSrc(sanityImage, { autoFormat: true });
    expect(result).toBe('https://cdn.sanity.io/images/mocked.jpg');
  });

  it('should return null for invalid Sanity object (non-object primitive)', () => {
    const result = normalizeImageSrc({ invalid: 'object' });
    // This depends on urlFor's error handling; assume it throws or returns null
    expect(result).toBeNull();
  });

  it('should handle options combination', () => {
    const sanityImage = {
      _type: 'image',
      asset: {
        _ref: 'image-abc123',
      },
    };
    const result = normalizeImageSrc(sanityImage, { width: 1200, autoFormat: true });
    expect(result).toBe('https://cdn.sanity.io/images/mocked.jpg');
  });

  it('should preserve string URL when no options provided', () => {
    const url = 'https://example.com/image.jpg';
    expect(normalizeImageSrc(url)).toBe(url);
  });

  it('should handle empty object', () => {
    const result = normalizeImageSrc({});
    expect(result).toBeNull();
  });
});
