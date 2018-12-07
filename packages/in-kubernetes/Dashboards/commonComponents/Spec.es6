import React from 'react';
import yaml from 'js-yaml';

import ExpandableCard from 'in-new-components/ExpandableCard';
import { getRawPayload } from 'in-stores/snapshot';
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

    return (
      <ExpandableCard title="Spec">
        <Code showLineNumbers={false} code={yaml.safeDump(spec.toJS())} lang="yaml" />
      </ExpandableCard>
    );
  }
);
