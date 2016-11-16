import React from 'react';

export default {
  path: {
    titleName: 'Request Path',
    placeholder: '(.*)',
    testPlaceholder: '/',
    initialValue: '(/shop($|/))',
    help: (
      <span>
        Define a regular expression to match requests paths. Capture groups from matches of this regular{' '}
        expression are available in the service name field via the prefix <code>path</code>, e.g. {' '}
        <code>{'{path-1}'}</code> references the first capture group.
      </span>
    )
  },

  host: {
    titleName: 'Host Header',
    placeholder: '(.*)',
    testPlaceholder: 'example.com',
    initialValue: '(.*)',
    help: (
      <span>
        Define a regular expression to match HTTP host headers. Capture groups from matches of this regular {' '}
        expression are available in the service name field via the prefix <code>host</code>, e.g. {' '}
        <code>{'{host-1}'}</code> references the first capture group.
      </span>
    )
  }
};
