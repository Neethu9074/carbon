/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useTheme } from 'in-themes';

export default {
  title: 'in-theming/Shapes(deprecated)'
};

export const Shapes = () => {
  const theme = useTheme();
  return (
    <>
      <Rect />
      <Rect borderRadius={theme.ids.border.radius.option.small} />
      <Rect borderRadius={theme.ids.border.radius.option.medium} />
      <Rect borderRadius={theme.ids.border.radius.option.large} />
      <Rect borderRadius={theme.ids.border.radius.option.round} />
    </>
  );
};

function Rect({ borderRadius }) {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'grid',
        placeContent: 'center',
        marginBottom: 16,
        width: 150,
        height: 150,
        background: theme.ids.color.option.teal['500'],
        borderRadius
      }}
    >
      {borderRadius}
    </div>
  );
}
