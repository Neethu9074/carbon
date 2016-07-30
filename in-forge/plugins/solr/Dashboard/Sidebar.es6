import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import SolrInfo from '../SolrInfo';


export default function SolrSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Solr
        </Collapsible.Header>
        <Collapsible.Content>
          <SolrInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <DeployedUnitList snapshotId={snapshot.get('id')} />
    </div>
  );
}

SolrSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
