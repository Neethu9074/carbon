/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    let queues = snapshot.getIn(['data', 'queues'], emptyList);

    if (oneTimeQueues) {
      queues = queues.concat(oneTimeQueues);
    }

    return <KeyValueOverlay header={'Queues (' + queues.size + ')'} data={queues} />;
  }
);
