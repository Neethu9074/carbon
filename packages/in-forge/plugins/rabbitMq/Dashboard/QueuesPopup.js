import React from 'react';

import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyList } from 'in-services/fixedImmutables';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      oneTimeQueues: getRawPayload(props.snapshot.get('id'), 'oneTimeQueues')
    };
  },
  function QueuesPopup({ snapshot, oneTimeQueues }) {
    let allQueues = null;
    let queues = snapshot.getIn(['data', 'queues'], emptyList);

    allQueues = queues.concat(allQueues);

    if (oneTimeQueues) {
      allQueues = allQueues.concat(oneTimeQueues);
    }

    return <KeyValueOverlay header="Queues" data={allQueues} />;
  }
);
