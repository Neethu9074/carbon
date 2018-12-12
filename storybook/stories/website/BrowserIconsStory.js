import { storiesOf } from '@storybook/react';
import React from 'react';

import { userAgentParserBrowserNameToIcon } from 'in-websites/browserIcons';
import Root from '../_helpers/Root';

storiesOf('Websites/Browser Icons', module)
  .add('Icons', () => <BrowserIconList />);

function BrowserIconList() {
  return (
    <Root>
      {Object.keys(userAgentParserBrowserNameToIcon).map(name => (
        <div key={name} style={{margin: '2rem 1rem'}}>
          <img src={userAgentParserBrowserNameToIcon[name]} alt={name} style={{
            width: 64,
            height: 64,
            display: 'block'
          }} />
          <strong>{name}</strong>
        </div>
      ))}
    </Root>
  );
}
