/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { HorizontalIndicator, Li, LoadingSkeleton, Ul } from '@instana/components';

import {
  LogVolumeData,
  LogVolumeDetailsProps
} from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/types';
// eslint-disable-next-line no-restricted-imports
import { generateEmptyData } from './utils';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { t } from 'in-i18n';

import locals from './LogVolumeDetails.mless';

export default function LogVolumeDetails({ data, progress, timePeriod }: LogVolumeDetailsProps) {
  const { loading: isLoading } = progress;
  if (!data) {
    data = generateEmptyData(timePeriod);
  }

  return (
    <>
      {data?.map(({ month, totalVolumeGB, retentionPeriods }: LogVolumeData, index: number) =>
        isLoading ? (
          <div className={locals.loadingMock}>
            <HorizontalIndicator className={locals.loadingIndicator} progress={progress} />
            <LoadingSkeleton className={locals.skeleton} />
          </div>
        ) : (
          <div key={`${month}_${index}`} className={locals.LogVolumeDetailsContainer}>
            <Li className={locals.LogVolumeDetails}>
              <SubViewHeader>{t('in-settings:maintenanceWindow.months', { context: month })}</SubViewHeader>
              <SubViewHeader>{totalVolumeGB} GB</SubViewHeader>
            </Li>
            <div>
              <Ul className={locals.logVolumeItems}>
                {(['days7', 'days20', 'days30', 'days60', 'days90'] as const)
                  .filter(days => retentionPeriods[days] && retentionPeriods[days] > 0)
                  .map(days => (
                    <Li key={days}>
                      <div>{t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}</div>
                      <div>{retentionPeriods[days]} GB</div>
                    </Li>
                  ))}
              </Ul>
            </div>
          </div>
        )
      )}
    </>
  );
}
