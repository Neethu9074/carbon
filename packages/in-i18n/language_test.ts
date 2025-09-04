/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-env jest */

import { browserLang, fallbackLanguage } from 'in-i18n/language';

describe('browserLang', () => {
  const supportedLangs = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'ja-JA', 'ko-KO', 'pt-BR', 'zh-CN', 'zh-TW'];

  it('should return the provided language if it is supported', () => {
    supportedLangs.forEach(lang => {
      expect(browserLang(lang)).toBe(lang);
    });
  });

  it('should return fallback language when provided language is null or undefined', () => {
    expect(browserLang(null as unknown as string)).toBe(fallbackLanguage);
    expect(browserLang(undefined as unknown as string)).toBe(fallbackLanguage);
    expect(browserLang('')).toBe(fallbackLanguage);
  });

  it('should find matching language based on language code prefix', () => {
    expect(browserLang('en')).toBe('en-US');
    expect(browserLang('en-GB')).toBe('en-US');
    expect(browserLang('de')).toBe('de-DE');
    expect(browserLang('fr')).toBe('fr-FR');
  });

  it('should return fallback language when no match is found', () => {
    expect(browserLang('ru-RU')).toBe(fallbackLanguage);
    expect(browserLang('ar')).toBe(fallbackLanguage);
    expect(browserLang('hi-IN')).toBe(fallbackLanguage);
  });

  it('should handle case sensitivity correctly', () => {
    expect(browserLang('EN-us')).toBe(fallbackLanguage);
    expect(browserLang('en-us')).toBe(fallbackLanguage);
  });

  it('should handle malformed language strings', () => {
    expect(browserLang('en_US')).toBe('en-US');
    expect(browserLang('fr_')).toBe(fallbackLanguage);
  });
});

// Made with Bob
