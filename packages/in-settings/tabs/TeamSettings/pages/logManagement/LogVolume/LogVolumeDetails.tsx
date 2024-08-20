/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { HorizontalIndicator, Li, LoadingSkeleton, Ul, SvgIcon } from '@instana/components';

import {
  LogVolumeData,
  LogVolumeDetailsProps
} from 'in-settings/tabs/TeamSettings/pages/logManagement/LogVolume/types';
// eslint-disable-next-line no-restricted-imports
import { generateEmptyData } from './utils';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { t } from 'in-i18n';

import locals from './LogVolumeDetails.mless';

export default function LogVolumeDetails({
  data,
  progress,
  timePeriod,
  expandedRetention,
  handleUpdateExpandedRetention
}: LogVolumeDetailsProps) {
  const { loading: isLoading } = progress;

  if (!data && isLoading) {
    data = generateEmptyData(timePeriod);
  }

  const handleToggle = (month: string, days: string) => {
    handleUpdateExpandedRetention((prev: any) => ({
      ...prev,
      [`${month}_${days}`]: !prev[`${month}_${days}`]
    }));
  };
  return (
    <>
      {data
        ?.filter(({ totalVolumeGB }: LogVolumeData) => totalVolumeGB > 0)
        .map((item: LogVolumeData, index: number) => {
          const { month, totalVolumeGB, retentionPeriods } = item;
          const hasPartialSums = 'partialSums' in item;
          const partialSums = hasPartialSums ? (item as { partialSums: { [key: string]: number } }).partialSums : null;

          return isLoading ? (
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
                  {!hasPartialSums ? (
                    <Ul className={locals.logVolumeItems}>
                      {(['days30', 'days60', 'days90'] as const)
                        .filter(days => {
                          const period = retentionPeriods[days];
                          return Array.isArray(period) ? period.length > 0 : period > 0;
                        })
                        .map(days => (
                          <Li key={days} className={locals.retentionDays}>
                            <div>{t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}</div>
                            <div>{retentionPeriods[days]} GB</div>
                          </Li>
                        ))}
                    </Ul>
                  ) : (
                    <div>
                      <Ul className={locals.logVolumeItems}>
                        {(['days30', 'days60', 'days90'] as const)
                          .filter(days => retentionPeriods[days] && partialSums && partialSums[days] > 0)
                          .map(days => (
                            <>
                              <Li key={days} onClick={() => handleToggle(month, days)} className={locals.retentionDays}>
                                {t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}
                                <div>
                                  {partialSums && partialSums[days]} GB
                                  <span className={locals.collapseRow}>
                                    <SvgIcon
                                      type={
                                        expandedRetention[`${month}_${days}`]
                                          ? 'lib_arrow_expand_up'
                                          : 'lib_arrow_expand_down'
                                      }
                                      size="s"
                                    />
                                  </span>
                                </div>
                              </Li>

                              {expandedRetention[`${month}_${days}`] && (
                                <div>
                                  {(retentionPeriods[days] as { label: string; volumeGB: number }[])
                                    ?.filter((item: { label: string; volumeGB: number }) => item.volumeGB > 0)
                                    .map(({ label, volumeGB }) => (
                                      <>
                                        <div key={label} className={locals.logVolumeCategories}>
                                          <div>{label}</div>
                                          <div>{volumeGB} GB</div>
                                        </div>
                                      </>
                                    ))}
                                </div>
                              )}
                            </>
                          ))}
                      </Ul>
                    </div>
                  )}
                </Ul>
              </div>
            </div>
          );
        })}
    </>
  );
}
