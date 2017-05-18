import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';

import './RelatedSnapshotList.less';

const block = 'in-related-snapshot-list';

export default function ServiceEndpointsList({ snapshot }) {
  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header className={block + '__header'}>
          Service Endpoints
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {snapshot.getIn(['data', 'service_endpoints'], emptyList).map(endpointName =>
              <DescriptionItem
                title=""
                id={endpointName}
                key={endpointName}
                >
                {endpointName}
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
