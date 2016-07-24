import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import KafkaInfo from '../KafkaInfo';


export default function KafkaSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Kafka</Collapsible.Header>
        <Collapsible.Content>
          <KafkaInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

KafkaSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
