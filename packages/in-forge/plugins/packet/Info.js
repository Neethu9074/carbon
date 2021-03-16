/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const tags = data.get('tags', emptyMap);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.packet.hostname')}>{data.get('hostname')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.packet.id')}>{data.get('id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.packet.iqn')}>{data.get('iqn')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.packet.facility')}>{data.get('facility')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.packet.plan')}>{data.get('plan')}</DescriptionItem>
      </DescriptionList>

      {tags.size > 0 ? <KeyValueOverlay header={t('in-forge:plugins.packet.tags')} data={tags} /> : null}
    </div>
  );
}
