import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';

import './ServiceEndpointsList.less';

const block = 'in-service-endpoint-list';

export default function ServiceEndpointsList({ snapshot }) {
  const endpoints = snapshot.getIn(['data', 'service_endpoints'], emptyList);
  if (endpoints.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header className={block + '__header'}>
          Endpoints
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {endpoints.map(endpointName => (
              <DescriptionItem className={`${block}__item`} title="" id={endpointName} key={endpointName}>
                {endpointName}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
