import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function MSMQSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Machine">
          {span.getIn(['data', 'msmq', 'machineName'])}
        </DescriptionItem>
        <DescriptionItem title="Queue">
          {span.getIn(['data', 'msmq', 'queueName'])}
        </DescriptionItem>
        <DescriptionItem title="Operation">
          {span.getIn(['data', 'msmq', 'operation'])}
        </DescriptionItem>
        <DescriptionItem title="Transaction-Type">
          {span.getIn(['data', 'msmq', 'txType'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
