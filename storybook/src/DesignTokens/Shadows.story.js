import React from 'react';

import theme from 'in-themes';

export default {
  title: 'DesignTokens|Shadows'
};

export const Shadows = () => {
  return (
    <>
      <Rect style={{ background: '#ccc' }}>None</Rect>
      <Rect style={{ boxShadow: theme.lib.shadows.subtle }}>Subtle</Rect>
      <Rect style={{ boxShadow: theme.lib.shadows.pronounced }}>Pronounced</Rect>
      <Rect style={{ boxShadow: theme.lib.shadows.strong }}>Strong</Rect>
    </>
  );
};

function Rect({ style, children }) {
  return <div style={{ marginBottom: 36, padding: 16, ...style }}>{children}</div>;
}
