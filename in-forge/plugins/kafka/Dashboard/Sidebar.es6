import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-components/Collapsible';

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
