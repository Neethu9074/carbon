/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { light, ThemeContext } from '@instana/components';

// In the future the default value depends on end-user configuration. This is
// a prepartion for this.
export default function GlobalTheme({ children }) {
  return <ThemeContext.Provider value={light}>{children}</ThemeContext.Provider>;
}
