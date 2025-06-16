/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CorrectionWindowWithName } from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes//CorrectionWindowsLane';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './CorrectionWindowsLaneTooltipContent.mless';

interface TooltipItemProps {
  windows: CorrectionWindowWithName[];
}

const visibleItemsCount = 2;

export default function CorrectionWindowsLaneTooltipContent({ windows }: TooltipItemProps) {
  const windowsCount = windows.length;

  if (windowsCount === 0) return null;

  return (
    <>
      <div className={locals.tooltipContent}>
        {windows.slice(0, visibleItemsCount).map(({ name, from }, i) => (
          <div key={`${from!}-${i}`}>
            <time dateTime={new Date(from!).toISOString()}>{formatDateTime(from!)}</time>
            <div className={locals.name}>{name}</div>
          </div>
        ))}
      </div>
      {windowsCount > visibleItemsCount && (
        <div>
          {t('in-service-levels:sloChart.correctionWindowsLane.tootltipMessage', {
            count: windowsCount - visibleItemsCount
          })}
        </div>
      )}
    </>
  );
}
