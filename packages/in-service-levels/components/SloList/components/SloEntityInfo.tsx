/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { SloEntityType } from '@instana/types';

import { LabeledEntity } from 'in-service-levels/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

interface Props {
  entity: LabeledEntity;
  entityType: SloEntityType;
}

type EntityDisplayData = {
  iconType: string;
  toolTipText: string;
};

export default function SloEntityInfo({ entity, entityType }: Props) {
  const { iconType, toolTipText } = getEntityDisplayData(entityType);

  return (
    <Stack direction="horizontal" align="center" gap="xxsmall">
      <Tooltip content={toolTipText}>
        <SvgIcon type={iconType} aria-label={toolTipText} />
      </Tooltip>
      <Typography variant="body-regular">{entity.label}</Typography>
    </Stack>
  );
}

function getEntityDisplayData(entityType: SloEntityType): EntityDisplayData {
  switch (entityType) {
    case 'application':
      return {
        iconType: 'lib_application',
        toolTipText: t('in-service-levels:sloList.components.sloEntityInfo.tooltip.applications')
      };

    case 'website':
      return {
        iconType: 'lib_website',
        toolTipText: t('in-service-levels:sloList.components.sloEntityInfo.tooltip.websites')
      };
  }
}
