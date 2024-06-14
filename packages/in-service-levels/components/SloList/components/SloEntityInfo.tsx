/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { SloEntityType } from '@instana/types';

import { LabeledEntity } from 'in-service-levels/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { t } from 'in-i18n';

interface Props {
  entity: LabeledEntity;
  entityType: SloEntityType;
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
  hasCustomFilter?: boolean;
  metaInfo?: boolean;
}

type EntityDisplayData = {
  iconType: string;
  toolTipText: string;
};

export default function SloEntityInfo({
  entity,
  entityType,
  hasCustomFilter,
  service,
  endpoint,
  metaInfo = false
}: Props) {
  const { iconType, toolTipText } = getEntityDisplayData(entityType, entity);
  const compact = useMediaQuery('(min-width: 600px)');
  const serviceEndpointInfo = entityType === 'application';
  const showServiceEndpointInfo = metaInfo && serviceEndpointInfo && compact && !hasCustomFilter;

  return (
    <Stack direction="horizontal" align="center">
      <Stack direction="horizontal" align="center" gap="xxsmall">
        <Tooltip content={toolTipText}>
          <SvgIcon type={iconType} aria-label={toolTipText} />
        </Tooltip>
        <Typography variant="body-regular">{entity.label}</Typography>
      </Stack>
      {showServiceEndpointInfo && (
        <Typography variant="body-small">
          {t('in-service-levels:sloList.components.sloEntityInfo.service', {
            label: service?.label ?? t('in-service-levels:sloDashboard.components.scopeSection.apAllServices')
          })}
        </Typography>
      )}
      {showServiceEndpointInfo && (
        <Typography variant="body-small">
          {t('in-service-levels:sloList.components.sloEntityInfo.endpoint', {
            label: endpoint?.label ?? t('in-service-levels:sloDashboard.components.scopeSection.apAllEndpoints')
          })}
        </Typography>
      )}
    </Stack>
  );
}

function getEntityDisplayData(entityType: SloEntityType, entity: LabeledEntity): EntityDisplayData {
  return {
    iconType: entity.deleted ? 'lib_infra_unknownIcon' : `lib_${entityType}`,
    toolTipText: t('in-service-levels:sloList.components.sloEntityInfo.tooltip', {
      context: entityType
    })
  };
}
