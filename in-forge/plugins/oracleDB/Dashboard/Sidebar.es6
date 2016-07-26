import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import OracleDBInfo from '../OracleDBInfo';


export default function OracleDBSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>OracleDB</Collapsible.Header>
        <Collapsible.Content>
          <OracleDBInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

OracleDBSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
