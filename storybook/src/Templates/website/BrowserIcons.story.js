import React from 'react';

import { userAgentParserBrowserNameToIcon } from 'in-websites/browserIcons';

export default {
  title: 'Templates|website/BrowserIconList'
};

export function BrowserIcons() {
  return (
    <>
      {Object.keys(userAgentParserBrowserNameToIcon).map(name => (
        <div key={name} style={{ margin: '2rem 1rem' }}>
          <img
            src={userAgentParserBrowserNameToIcon[name]}
            alt={name}
            style={{
              width: 64,
              height: 64,
              display: 'block'
            }}
          />
          <strong>{name}</strong>
        </div>
      ))}
    </>
  );
}
