/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getThemeOverride } from '@instana/components';

import { useTheme } from 'in-themes';

export default {
  title: 'in-theming/useTheme',
  args: {
    cdsTokenName: 'background-brand'
  }
};

export function AccessDesignToken({ cdsTokenName }: { cdsTokenName: string }) {
  const { cds } = useTheme();

  // @ts-expect-error cdsTokenName might not be the right type, for simplicity, let's ignore it here.
  const selectedTokenValue = cds[cdsTokenName];

  return (
    <div>
      <h2>
        Current theme: <strong>{getThemeOverride() ?? 'instana'}</strong>
      </h2>
      <p>Playground: Use control addon to select a different CDS token:</p>
      <div style={{ padding: '1rem', background: selectedTokenValue }}>
        <code>cds.{cdsTokenName}</code>: <strong>{selectedTokenValue}</strong>
      </div>
      <br />
    </div>
  );
}
