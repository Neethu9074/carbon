/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

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

export default function LogVolumeDetails({ data, progress, timePeriod }: LogVolumeDetailsProps | any) {
  const [expandedRetention, setExpandedRetention] = useState<any>({});

  const { loading: isLoading } = progress;

  if (!data && isLoading) {
    data = generateEmptyData(timePeriod);
  }

  const handleToggle = (month: string, days: string) => {
    setExpandedRetention((prev: any) => ({
      ...prev,
      [`${month}_${days}`]: !prev[`${month}_${days}`]
    }));
  };

  return (
    <>
      {data
        ?.filter(({ totalVolumeGB }: any) => totalVolumeGB > 0)
        .map(({ month, totalVolumeGB, retentionPeriods, partialSums }: LogVolumeData | any, index: number) =>
          isLoading ? (
            <div key={`${month}_${index}`} className={locals.loadingMock}>
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
                  {!partialSums ? (
                    <Ul className={locals.logVolumeItems}>
                      {(['days30', 'days60', 'days90'] as const)
                        .filter(days => retentionPeriods[days] && retentionPeriods[days] > 0)
                        .map(days => (
                          <Li key={days} className={locals.retentionDays}>
                            <div>{t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}</div>
                            <div>{retentionPeriods[days]} GB</div>
                          </Li>
                        ))}
                    </Ul>
                  ) : (
                    (['days30', 'days60', 'days90'] as const)
                      .filter(days => retentionPeriods[days] && partialSums[days] > 0)
                      .map(days => (
                        <div key={days}>
                          <Li key={days} onClick={() => handleToggle(month, days)} className={locals.retentionDays}>
                            {t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}
                            <div>{partialSums[days]} GB</div>
                          </Li>
                          {expandedRetention[`${month}_${days}`] && (
                            <Ul className={locals.logVolumeItems}>
                              {retentionPeriods[days]
                                ?.filter((item: any) => item.volumeGB > 0)
                                .map(({ label, volumeGB }: any) => (
                                  <Li key={label}>
                                    <div>{label}</div>
                                    <div>{volumeGB} GB</div>
                                  </Li>
                                ))}
                            </Ul>
                          )}
                        </div>
                      ))
                  )}
                </Ul>
              </div>
            </div>
          )
        )}
    </>
  );
}
