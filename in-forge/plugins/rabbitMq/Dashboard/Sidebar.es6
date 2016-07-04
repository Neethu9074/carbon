import irpt from 'react-immutable-proptypes';
import React from 'react';

import RabbitMqInfo from 'in-forge/plugins/rabbitMq/RabbitMqInfo';
import Collapsible from 'in-components/Collapsible';


export default function RabbitMqSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          RabbitMq
        </Collapsible.Header>
        <Collapsible.Content>
            <RabbitMqInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

RabbitMqSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
