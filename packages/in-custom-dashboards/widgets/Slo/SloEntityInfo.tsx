/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack, SvgIcon } from '@instana/components';

import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Application, Website } from 'in-types';
import { t } from 'in-i18n';

import locals from './SloEntityInfo.mless';

interface WidgetLeftHeaderProps {
  entity: Application | Website;
  entityType: MonitoringSource;
}

type EntityDisplayData = {
  iconType: string;
  toolTipText: string;
};

export default function SloEntityInfo({ entity, entityType }: WidgetLeftHeaderProps) {
  const { iconType, toolTipText } = getEntityDisplayData(entityType);

  return (
    <Stack direction="horizontal">
      <Tooltip content={toolTipText}>
        <SvgIcon type={iconType} aria-label={toolTipText} />
      </Tooltip>
      <span className={locals.entityLabel}>{entity.label}</span>
    </Stack>
  );
}

function getEntityDisplayData(entityType: MonitoringSource): EntityDisplayData {
  switch (entityType) {
    case 'application':
      return {
        iconType: 'lib_application',
        toolTipText: t('in-custom-dashboards:widgets.slo.sloEntityInfo.tooltip.applications')
      };

    case 'website':
      return {
        iconType: 'lib_website',
        toolTipText: t('in-custom-dashboards:widgets.slo.sloEntityInfo.tooltip.websites')
      };
  }
}
