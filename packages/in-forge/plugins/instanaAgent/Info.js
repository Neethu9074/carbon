/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { modes, logLevels } from 'in-forge/plugins/instanaAgent/modes';
import { emptyMap } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const java = snapshot.getIn(['data', 'java'], emptyMap);
  const startedAt = data.get('startedAt');
  const origin = data.get('origin');
  const agentVersion = data.get('agentVersion');
  const updateMode = data.get('updateMode');

  return (
    <DescriptionList>
      {agentVersion && <DescriptionItem title="Agent Version">{agentVersion}</DescriptionItem>}
      <DescriptionItem title="Boot Version">{data.get('boot')}</DescriptionItem>
      {origin && <DescriptionItem title="Origin">{origin}</DescriptionItem>}
      {updateMode && <DescriptionItem title="Update Mode">{updateMode}</DescriptionItem>}
      <DescriptionItem title="Log Level">{logLevels[data.get('loglevel')]}</DescriptionItem>
      <DescriptionItem title="Mode">{modes[data.get('mode')]}</DescriptionItem>
      <DescriptionItem title="Java Runtime">
        {java.get('vmvendor')} {java.get('vmname') && `(${java.get('vmname')})`}
      </DescriptionItem>
      <DescriptionItem title="Java Version">
        {java.get('version')} {java.get('vmversion')}
      </DescriptionItem>
      <DescriptionItem title="User">{data.get('user')}</DescriptionItem>
      {startedAt != null && (
        <DescriptionItem title="Started At">
          {formatDateTime(startedAt)} ({fromNowAccurately(startedAt)})
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
