/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Pill, SvgIcon, IconButton } from '@instana/components';

import { userSettingsThemeEnabled } from 'in-services/featureFlags';

/**
 * This is a simplistic UI for indicating the current theme, and
 * for enabling easily switching the theme.
 *
 * It will be only a temporary solution for next few weeks only, until
 * G10 theme will be enabled in production.
 *
 * @param theme the current theme override or empty
 * @param setOverride callback that gets run when theme selection was clicked with either
 *  'default', 'g10' or undefined
 */
export const SwitchTheme = ({ theme, setOverride }) => {
  const [closed, setClosed] = useState(false);

  if (!userSettingsThemeEnabled || closed) return null;

  const isDefault = theme === 'default';
  const isG10 = theme === 'g10';
  return (
    <div
      style={{
        zIndex: 9999,
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        bottom: 0,
        padding: '0 0 0 1em',
        // obviously not-carbon - colors - to avoid confusion: not part of the product
        background: 'beige',
        border: '1px gold dashed'
      }}
    >
      <span>In Dev Mode only: Override the theme:</span>
      <Pill type="teal" onClick={() => setOverride('default')}>
        {isDefault && <SvgIcon size={8} type="lib_fancy_checkbox_checked" />} Instana
      </Pill>
      <Pill type="blue" onClick={() => setOverride('g10')}>
        {isG10 && <SvgIcon size={8} type="lib_fancy_checkbox_checked" />} carbon g10
      </Pill>
      {(isDefault || isG10) && (
        <button type="button" onClick={() => setOverride(undefined)}>
          Reset to default
        </button>
      )}
      <IconButton
        type="lib_openclose_cancel"
        color="black"
        size="compact"
        onClick={() => setClosed(true)}
        iconDescription={'close this overlay'}
      />
    </div>
  );
};
