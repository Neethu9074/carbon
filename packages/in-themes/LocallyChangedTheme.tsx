/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import * as React from 'react';

import { ThemeContext } from '@instana/components';

interface Props {
  children: React.ReactNode;
  theme: string;
}

export default function LocallyChangedTheme({ theme, children }: Props) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
