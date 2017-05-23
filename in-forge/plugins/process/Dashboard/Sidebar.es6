import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import ArgList from 'in-forge/plugins/process/ArgList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';

import Info from '../Info';

export default function ProcessSidebar({ snapshot }) {
  const args = snapshot.getIn(['data', 'args']);
  const env = snapshot.getIn(['data', 'env']);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>
          Process
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {args && args.size > 0
        ? <div>
            <Separator />
            <Collapsible initiallyOpen={false}>
              <Collapsible.Header>
                Arguments
              </Collapsible.Header>
              <Collapsible.Content>
                <ArgList snapshot={snapshot} />
              </Collapsible.Content>
            </Collapsible>
          </div>
        : null}

      {env && env.size > 0
        ? <div>
            <Separator />
            <KeyValuePopupButton title={`Environment`} data={env}>
              Show Environment
            </KeyValuePopupButton>
          </div>
        : null}
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
