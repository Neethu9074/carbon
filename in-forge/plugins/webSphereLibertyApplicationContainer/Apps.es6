import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyMap } from 'in-services/fixedImmutables';

export default function Apps({ snapshot }) {
  const apps = snapshot.getIn(['data', 'applications'], emptyMap).toOrderedMap();
  if (apps.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          Application States
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {apps
              .map((appData, appName) => (
                <DescriptionItem title={appName}>
                  {appData.get('state')}
                </DescriptionItem>
              ))
              .valueSeq()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
