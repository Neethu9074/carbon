/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { ThemeContext } from 'in-themes/themes';

// Normally this component would not be necessary. Unfortunately though
// we are going to need it in order to support the transition phase from
// the theme `light` to `lightV2`.
export default function LocallyChangedTheme({ theme, children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
