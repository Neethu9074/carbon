import React, { Fragment } from 'react';
import { get } from 'lodash';

import EntryOrExitWrapper from 'in-analyze/TraceDetail/components/CallDetails/components/EntryOrExitWrapper';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Infrastructure({ call }) {
  return (
    <Fragment>
      <InfrastructureListing physicalContext={get(call, ['source', 'physicalContext'])} />
      <InfrastructureListing physicalContext={get(call, ['destination', 'physicalContext'])} isEntry />
    </Fragment>
  );
}

function InfrastructureListing({ physicalContext, isEntry }) {
  if (!physicalContext) {
    return null;
  }

  const zone = physicalContext.zone;
  const host = physicalContext.host;
  const container = physicalContext.container;
  const process = physicalContext.process;

  return (
    <EntryOrExitWrapper>
      <DescriptionList isEntry={isEntry}>
        {zone && <DescriptionItem title={'zone'}>{zone.label}</DescriptionItem>}
        {host && <DescriptionItem title={'host'}>{host.label}</DescriptionItem>}
        {container && <DescriptionItem title={'container'}>{container.label}</DescriptionItem>}
        {process && <DescriptionItem title={'process'}>{process.label}</DescriptionItem>}
      </DescriptionList>
    </EntryOrExitWrapper>
  );
}
