/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Language } from 'prism-react-renderer';

export function getStackTraceLanguage(stackTrace?: string | null): Language | null {
  if (!stackTrace) return null;

  const patterns: { lang: Language; regex: RegExp }[] = [
    {
      lang: 'javascript',
      regex: /\bat\s.*?\(.+?\.js(?::\d+)*\)/
    },
    {
      lang: 'python',
      regex: /File\s".+?\.py",\sline\s\d+/
    },
    {
      lang: 'java' as Language,
      regex: /\bat\s[\w.]+(?:\.[\w$]+)+\(.+?\.java:\d+\)/
    },
    {
      lang: 'go',
      regex: /\t.+?\.go:\d+/
    }
  ];

  for (const { lang, regex } of patterns) {
    if (regex.test(stackTrace)) return lang;
  }

  return null;
}

export function getPrettifiedJSON(string: string): string | null {
  try {
    const parsed = JSON.parse(string);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return null;
  }
}
