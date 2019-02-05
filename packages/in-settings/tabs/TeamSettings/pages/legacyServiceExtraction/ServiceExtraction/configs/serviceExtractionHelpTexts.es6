import React from 'react';

export default Object.freeze({
  viewHelp: 'overwrite in concrete module',
  matchesHelp: 'overwrite in concrete module',
  serviceNameHelp: (
    <span>
      Give this service a name. This service name will be used throughout Instana. You can reference capture groups{' '}
      extracted from the match expressions to dynamically build a service name. Additionally, Docker labels and host
      tags can be used. The following example shows how to use the <code>com.amazonaws.ecs.cluster</code> Docker label:{' '}
      <code>{'{docker.label-com.amazonaws.ecs.cluster}'}</code>. The following example shows how to use the{' '}
      <code>zone</code> host tag: <code>{'{host.tag-zone}'}</code>.
    </span>
  ),
  serviceEndpointNameHelp: (
    <span>
      Give this endpoint a name. This endpoint name will be used throughout Instana. You can reference capture groups{' '}
      extracted from the match expressions to dynamically build an endpoint name. Additionally, Docker labels and host
      tags can be used. The following example shows how to use the <code>com.amazonaws.ecs.cluster</code> Docker label:{' '}
      <code>{'{docker.label-com.amazonaws.ecs.cluster}'}</code>. The following example shows how to use the{' '}
      <code>zone</code> host tag: <code>{'{host.tag-zone}'}</code>.
    </span>
  ),
  commentHelp: 'Describe the intent behind this rule for your colleagues and your future self.'
});
