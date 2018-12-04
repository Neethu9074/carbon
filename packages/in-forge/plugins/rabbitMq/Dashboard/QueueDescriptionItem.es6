import React from 'react';

import { DescriptionItem } from 'in-components/DescriptionList';
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
    let size = 0;
    let queues = snapshot.getIn(['data', 'queues'], emptyList);

    size += queues.size;

    if (oneTimeQueues) {
      size += oneTimeQueues.size;
    }

    return <DescriptionItem title="Queues">{size}</DescriptionItem>;
  }
);
