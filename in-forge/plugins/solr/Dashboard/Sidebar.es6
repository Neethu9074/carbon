import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {emptyList} from 'in-services/fixedImmutables';

import SolrInfo from '../SolrInfo';
import SolrCoreInfo from '../SolrCoreInfo';

export default function SolrSidebar({snapshot}) {
  const coreNames = snapshot.getIn(['data', 'core_names'], emptyList).sort();

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
      <div>
        Cores
        {
          coreNames.map(cn =>
            <Collapsible initiallyOpen={true} key={cn}>
              <Collapsible.Header>
                {cn}
              </Collapsible.Header>
              <Collapsible.Content>
                <SolrCoreInfo snapshot={snapshot} core={cn} />
              </Collapsible.Content>
            </Collapsible>
          )
        }
      </div>
    </div>
  );
}

SolrSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
