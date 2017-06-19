import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { DescriptionList } from 'in-components/DescriptionList';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyMap } from 'in-services/fixedImmutables';

export default function WebApps({ snapshot }) {
  const webApps = snapshot.getIn(['data', 'appInfo'], emptyMap).toOrderedMap();
  if (webApps.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      {webApps.map((info, webAppName) =>
        <Collapsible initiallyOpen={false} key={webAppName}>
          <Collapsible.Header>
            App [{webAppName}]
          </Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}
    </div>
  );
}
