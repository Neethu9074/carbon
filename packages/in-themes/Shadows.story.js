/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useTheme } from 'in-themes';

export default {
  title: 'in-theming/Shadows(deprecated)'
};

export const Shadows = () => {
  const theme = useTheme();
  return (
    <>
      <Rect style={{ background: '#ccc' }}>None</Rect>
      <Rect style={{ boxShadow: theme.ids.shadow.option.subtle }}>Subtle</Rect>
      <Rect style={{ boxShadow: theme.ids.shadow.option.pronounced }}>Pronounced</Rect>
      <Rect style={{ boxShadow: theme.ids.shadow.option.strong }}>Strong</Rect>
    </>
  );
};

function Rect({ style, children }) {
  return <div style={{ marginBottom: 36, padding: 16, ...style }}>{children}</div>;
}
