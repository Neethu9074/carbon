/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon, Typography, Stack, CarbonTile } from '@instana/components';
import { Size } from '@instana/components/types/components/SvgIcon/types';

import locals from 'in-plg/components/DashboardTile/DashboardTile.mless';

export type DashboardTileProps = {
  children?: ReactNode;
  header?: string;
  icon?: string;
  size?: Size;
  titleMetrics?: string;
  dragAndDropConfigs?: any;
  handleLabel?: string;
};

export function DashboardTile({
  children,
  icon = 'lib_actions_reorder',
  size,
  header,
  titleMetrics,
  dragAndDropConfigs = [],
  handleLabel
}: Readonly<DashboardTileProps>) {
  return (
    <CarbonTile className={locals.dashboardtile}>
      <div
        className={classNames({
          [locals.headerWrapper]: header !== ''
        })}
      >
        <Stack direction="horizontal" distribution="spaceBetween">
          <Stack direction="horizontal" align="center" gap="normal">
            {icon ? (
              <div className={locals.dragHandleIcon} {...dragAndDropConfigs}>
                <SvgIcon type={icon} size={size} color="var(--ids-color-option-neutral-700)" aria-label={handleLabel} />
              </div>
            ) : null}
            {header ? (
              <Typography variant="heading-03" noMargin>
                {header} {titleMetrics && `(${titleMetrics})`}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </div>
      {children}
    </CarbonTile>
  );
}
