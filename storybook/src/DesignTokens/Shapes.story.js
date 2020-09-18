import theme from 'in-themes';
import React from 'react';

export default {
  title: 'DesignTokens/Shapes'
};

export const Shapes = () => {
  return (
    <>
      <Rect />
      <Rect borderRadius={theme.lib.shapes.radius_small} />
      <Rect borderRadius={theme.lib.shapes.radius_medium} />
      <Rect borderRadius={theme.lib.shapes.radius_large} />
      <Rect borderRadius={theme.lib.shapes.radius_round} />
    </>
  );
};

function Rect({ borderRadius }) {
  return (
    <div
      style={{
        display: 'grid',
        placeContent: 'center',
        marginBottom: 16,
        width: 150,
        height: 150,
        background: theme.lib.colors.primary1,
        borderRadius
      }}
    >
      {borderRadius}
    </div>
  );
}
