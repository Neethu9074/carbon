/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import { replaceHtmlChars } from 'in-services/formatters/html';

describe('in-services/formatters/html', () => {
  it('must replace common HTML chars', () => {
    const s = `
<VirtualHost localhost:90>
<Location "/server-status">
   SetHandler server-status
   Order deny,allow
   Deny from all
   AllowOverride None
   Allow from localhost
</Location>
</VirtualHost>
    `.trim();

    expect(replaceHtmlChars(s)).to.equal(
      `
&lt;VirtualHost localhost:90&gt;
&lt;Location "/server-status"&gt;
   SetHandler server-status
   Order deny,allow
   Deny from all
   AllowOverride None
   Allow from localhost
&lt;/Location&gt;
&lt;/VirtualHost&gt;
      `.trim()
    );
  });
});
