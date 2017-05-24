import React from 'react';

export default Object.freeze({
  viewHelp: 'overwrite in concrete module',
  matchesHelp: 'overwrite in concrete module',
  serviceNameHelp: (
    <span>
      Give this service a name. This service name will be used throughout Instana. You can reference capture groups{' '}
      extracted from the match expressions to dynamically build a service name. Additionally, Docker labels can be{' '}
      used. The following examples shows how to use the <code>foo.bar</code> Docker label:{' '}
      <code>{'{docker.label-foo.bar}'}</code>.
    </span>
  ),
  serviceEndpointNameHelp: (
    <span>
      Give this endpoint a name. This endpoint name will be used throughout Instana. You can reference capture groups
      {' '}
      extracted from the match expressions to dynamically build an endpoint name. Additionally, Docker labels can be
      {' '}
      used. The following examples shows how to use the <code>foo.bar</code> Docker label:{' '}
      <code>{'{docker.label-foo.bar}'}</code>.
    </span>
  ),
  commentHelp: 'Describe the intent behind this rule for your colleagues and your future self.'
});
