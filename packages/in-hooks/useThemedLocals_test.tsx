/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { light, dark, ThemeContext } from '@instana/components';

import useThemedLocals from 'in-hooks/useThemedLocals';

const testLocals = {
  button: 'base button',
  [`button_${light}`]: 'button light',
  [`button_${dark}`]: 'button dark'
};

test('useThemedLocals must relabel dark mode vars', () => {
  expect(testUseThemedLocals(testLocals, dark)).toMatchInlineSnapshot(`
    Object {
      "button": "button dark",
      "button_dark": "button dark",
      "button_light": "button light",
    }
  `);
});

function testUseThemedLocals(locals: Record<string, string>, theme: string): Record<string, string> {
  const wrapper = ({ children }: { children: any }) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
  const { result } = renderHook(() => useThemedLocals(locals), { wrapper });
  return result.current;
}

test('useThemedLocals must relabel light mode vars', () => {
  expect(testUseThemedLocals(testLocals, light)).toMatchInlineSnapshot(`
    Object {
      "button": "button light",
      "button_dark": "button dark",
      "button_light": "button light",
    }
  `);
});
