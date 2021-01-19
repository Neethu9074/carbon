/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { lightV2, ThemeContext } from 'in-themes/themes';

// In the future the default value depends on end-user configuration. This is
// a prepartion for this.
export default function GlobalTheme({ children }) {
  return <ThemeContext.Provider value={lightV2}>{children}</ThemeContext.Provider>;
}
