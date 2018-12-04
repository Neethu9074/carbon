import React from 'react';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId }) => {
    return {
      annotations: getRawPayload(snapshotId, 'annotations').map(payload => {
        return payload;
      })
    };
  },
  function AnnotationsList({ annotations }) {
    if (!annotations || annotations.length === 0) {
      return null;
    }

    const items = annotations.entrySeq().map(([key, value]) => ({ key, value: parseAndPrettyPrint(value) }));

    return <KeyValueList title="Annotations" items={items} />;
  }
);

function parseAndPrettyPrint(value) {
  try {
    const json = JSON.parse(value);
    return (
      <pre>
        <code>{JSON.stringify(json, null, 2)}</code>
      </pre>
    );
  } catch (e) {
    return value;
  }
}
