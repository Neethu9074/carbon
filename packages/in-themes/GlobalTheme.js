import React from 'react';

import { light, ThemeContext } from 'in-themes/themes';

// In the future the default value depends on end-user configuration. This is
// a prepartion for this.
export default function GlobalTheme({ children }) {
  return <ThemeContext.Provider value={light}>{children}</ThemeContext.Provider>;
}
