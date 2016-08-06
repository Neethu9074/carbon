import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import {emptyList} from 'in-services/fixedImmutables';

import SolrInfo from '../SolrInfo';
import SolrCoreInfo from '../SolrCoreInfo';

export default function SolrSidebar({snapshot}) {
  const coreNames = snapshot.getIn(['data', 'core_names'], emptyList).toArray().sort();

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

      {coreNames.map(cn =>
        <div key={cn}>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              Core {cn}
            </Collapsible.Header>
            <Collapsible.Content>
              <SolrCoreInfo snapshot={snapshot} core={cn} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
