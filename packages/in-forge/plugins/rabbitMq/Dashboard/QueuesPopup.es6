import React from 'react';

import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import { getRawPayload } from 'in-stores/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
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

    return <KeyValuePopup header="Queues" data={allQueues} />;
  }
);
