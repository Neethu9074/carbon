import irpt from 'react-immutable-proptypes';
import React from 'react';

import ActiveMQInfo from 'in-forge/plugins/activeMQ/ActiveMQInfo';
import Collapsible from 'in-components/Collapsible';


export default function ActiveMQSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          ActiveMQ
        </Collapsible.Header>
        <Collapsible.Content>
          <ActiveMQInfo snapshot={snapshot}/>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

ActiveMQSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
