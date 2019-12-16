import React from 'react';

import theme from 'in-themes';

export default {
  title: 'DesignTokens|Typography'
};

export const Typography = () => {
  return (
    <>
      {Object.keys(theme.lib.typography).map(configName => (
        <TypoComponent key={configName} config={theme.lib.typography[configName]}>
          {configName}
        </TypoComponent>
      ))}
    </>
  );
};

function TypoComponent({ config, children }) {
  return <div style={{ marginBottom: 76, ...config }}>{children}</div>;
}
