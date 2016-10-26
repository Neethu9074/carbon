import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import {emptyMap} from 'in-services/fixedImmutables';
import {formatDateTime} from 'in-services/formatters/date';


export default function WebApps({snapshot}) {
  const data = snapshot.get('data');
  const webApps = data.get('appInfo', emptyMap).toOrderedMap();
  if (webApps.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />
      {webApps.map((info, webAppName) =>
        <Collapsible initiallyOpen={false}
                     key={webAppName}>
          <Collapsible.Header>App [{webAppName}]</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title='Started At'>
                {formatDateTime(info.get('startedAt'))}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}
    </div>
  );
}
