/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const snapshotData = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{snapshotData.get('queueName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.processId')}>{snapshotData.get('pid')}</DescriptionItem>
    </DescriptionList>
  );
}
