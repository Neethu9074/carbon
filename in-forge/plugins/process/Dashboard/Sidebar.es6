import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import ProcessInfo from 'in-forge/plugins/process/ProcessInfo';
import Separator from 'in-sdk/components/sidebar/Separator';
import ArgList from 'in-forge/plugins/process/ArgList';


export default function ProcessSidebar({snapshot}) {
  const args = snapshot.getIn(['data', 'args']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Process
        </Collapsible.Header>
        <Collapsible.Content>
          <ProcessInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      {args && args.size > 0 ?
        <div>
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              Arguments
            </Collapsible.Header>
            <Collapsible.Content>
              <ArgList snapshot={snapshot} />
            </Collapsible.Content>
          </Collapsible>

          <Separator />
        </div>
        : null
      }
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
