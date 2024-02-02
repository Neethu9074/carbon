/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { t } from '@instana/i18n-react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';

export default function Ec2TagsSidebar({ snapshot }: { snapshot: Map<string, Map<string, string>> }) {
  const data = snapshot.get('data');
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.ec2.instanceId')}>{data.get('instance-id')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.ec2.nameFromVirtualisationLayer')}>
          {data.get('nameFromVirtualisationLayer')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.ec2.nameFromVirtualisationLayerIsUnique.label')}>
          {data.get('nameFromVirtualisationLayerIsUnique')
            ? t('in-forge:plugins.ec2.nameFromVirtualisationLayerIsUnique.yes')
            : t('in-forge:plugins.ec2.nameFromVirtualisationLayerIsUnique.no')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
