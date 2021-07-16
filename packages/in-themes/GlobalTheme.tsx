/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import * as React from 'react';

import { light, ThemeContext } from '@instana/components';

interface Props {
  children: React.ReactNode;
}

// In the future the default value depends on end-user configuration. This is
// a prepartion for this.
export default function GlobalTheme({ children }: Props) {
  return <ThemeContext.Provider value={light}>{children}</ThemeContext.Provider>;
}
