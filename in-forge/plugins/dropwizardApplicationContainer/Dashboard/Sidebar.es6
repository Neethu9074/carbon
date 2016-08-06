import React from 'react';

import DropwizardInfo from 'in-forge/plugins/dropwizardApplicationContainer/DropwizardInfo';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';


export default function DropwizardSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Dropwizard</Collapsible.Header>
        <Collapsible.Content>
          <DropwizardInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
