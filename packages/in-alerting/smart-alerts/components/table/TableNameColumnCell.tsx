/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Tooltip } from '@instana/components';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Location } from 'in-stores/navigation/types';

import locals from './TableNameColumnCell.mless';

export default function TableNameColumnCell<AlertConfig extends AlertConfigType>({
  config,
  getNameSubtitle,
  createRowLinkLocation,
  isCategoryGlobal
}: {
  config: AlertConfig;
  getNameSubtitle?:
    | ((config: AlertConfig, isCategoryGlobal?: boolean) => string)
    | ((config: AlertConfig, isCategoryGlobal?: boolean) => JSX.Element);
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  isCategoryGlobal?: boolean;
}) {
  const { location, createHref } = useNavigation();
  return (
    <Stack direction="vertical" gap="disabled">
      <Tooltip content={config.name} align="auto" delay={500} overwriteBlock>
        <div className={locals.name}>
          <a href={createRowLinkLocation && createHref(createRowLinkLocation(config, location))}>{config.name}</a>
        </div>
      </Tooltip>
      {getNameSubtitle && <span>{getNameSubtitle(config, isCategoryGlobal)}</span>}
    </Stack>
  );
}
