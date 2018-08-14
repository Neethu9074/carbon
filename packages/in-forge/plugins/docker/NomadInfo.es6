import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function NomadInfo({ snapshot }) {
  const nomad = snapshot.getIn(['data', 'Nomad']);
  if (!nomad || nomad.size === 0) {
    return null;
  }

  const ports = nomad.get('ports');

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Nomad</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Task Name">{nomad.get('taskName')}</DescriptionItem>
            <DescriptionItem title="Task Directory">{nomad.get('taskDir')}</DescriptionItem>
            <DescriptionItem title="Allocation ID">{nomad.get('allocId')}</DescriptionItem>
            <DescriptionItem title="Allocation Name">{nomad.get('allocName')}</DescriptionItem>
            <DescriptionItem title="Allocation Directory">{nomad.get('allocDir')}</DescriptionItem>
            <DescriptionItem title="Job Name">{nomad.get('jobName')}</DescriptionItem>
            <DescriptionItem title="CPU Limit">
              {nomad.get('cpuLimit') ? `${nomad.get('cpuLimit')} MHz` : null}
            </DescriptionItem>
            <DescriptionItem title="Memory Limit">
              {nomad.get('memoryLimit') ? `${nomad.get('memoryLimit')} MB` : null}
            </DescriptionItem>
          </DescriptionList>

          {ports && ports.size > 0 ? (
            <KeyValuePopupButton title="Port Names" data={ports}>
              Show port names
            </KeyValuePopupButton>
          ) : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
