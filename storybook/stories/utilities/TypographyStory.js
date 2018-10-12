import { storiesOf } from '@storybook/react';
import React from 'react';

import theme from 'in-themes';

import Root from '../_helpers/Root';

storiesOf('Utilities/Typography', module).add('typography', () => <Typography />);

function Typography() {
  return (
    <Root>
      {Object.keys(theme.lib.typography).map(configName => (
        <TypoComponent key={configName} config={theme.lib.typography[configName]}>
          {configName}
        </TypoComponent>
      ))}
    </Root>
  );
}

function TypoComponent({ config, children }) {
  return <div style={{ marginBottom: 76, ...config }}>{children}</div>;
}
