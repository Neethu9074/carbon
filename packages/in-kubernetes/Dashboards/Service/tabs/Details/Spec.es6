import React from 'react';
import yaml from 'js-yaml';

import { getRawPayload } from 'in-stores/snapshot';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

export default connectTo(
  ({ snapshotId }) => {
    return {
      spec: getRawPayload(snapshotId, 'spec')
    };
  },
  function SpecList({ spec }) {
    if (!spec || spec.length === 0) {
      return null;
    }

    return formatSpec(spec);
  }
);

function formatSpec(spec) {
  try {
    return (
      <Card title="Spec">
        <Code showLineNumbers={false} code={yaml.safeDump(spec.toJS())} lang="yaml" />
      </Card>
    );
  } catch (e) {
    return null;
  }
}
