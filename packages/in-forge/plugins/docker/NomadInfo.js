/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { megaBytesTwoDecimalPlaces } from 'in-services/formatters/number';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function NomadInfo({ snapshot }) {
  const nomad = snapshot.getIn(['data', 'Nomad']);
  if (!nomad || nomad.size === 0) {
    return null;
  }

  const ports = nomad.get('ports');

  return (
    <div>
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
            {nomad.get('memoryLimit') && (
              <DescriptionItem title="Memory Limit">
                {megaBytesTwoDecimalPlaces(nomad.get('memoryLimit'))}
              </DescriptionItem>
            )}
          </DescriptionList>

          {ports && ports.size > 0 ? <KeyValueOverlay header="Port Names" data={ports} /> : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
