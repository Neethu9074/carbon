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
                <div className={locals.totalVolumes}>
                  <SubViewHeader>{totalVolumeGB} GB</SubViewHeader>
                  <SubViewHeader>{totalVolumeGB} RU</SubViewHeader>
                </div>
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
                        .map((days, index: number) => (
                          <Li key={`${days}_${index}`} className={locals.retentionDays}>
                            <div>{t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}</div>
                            <div className={locals.totalVolumes}>
                              <div className={locals.volumeGB}>{retentionPeriods[days]} GB</div>
                              <div className={locals.volumeGB}>{retentionPeriods[days]} RU</div>
                            </div>
                          </Li>
                        ))}
                    </Ul>
                  ) : (
                    <div>
                      <Ul className={locals.logVolumeItems}>
                        {(['days30', 'days60', 'days90'] as const)
                          .filter(days => retentionPeriods[days] && partialSums && partialSums[days] > 0)
                          .map((days, index) => (
                            <React.Fragment key={`${days}_${index}`}>
                              <Li onClick={() => handleToggle(month, days)} className={locals.retentionDays}>
                                {t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}
                                <div className={locals.totalVolumes}>
                                  <div className={locals.volumeGB}>{partialSums && partialSums[days]} GB </div>
                                  <div className={locals.volumeGB}>
                                    {partialSums && partialSums[days]} RU
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
                                </div>
                              </Li>

                              {expandedRetention[`${month}_${days}`] && (
                                <div>
                                  {(retentionPeriods[days] as { label: string; volumeGB: number }[])
                                    ?.filter((item: { label: string; volumeGB: number }) => item.volumeGB > 0)
                                    .map(({ label, volumeGB }, index: number) => (
                                      <React.Fragment key={`${days}_${index}`}>
                                        <div key={label + index} className={locals.logVolumeCategories}>
                                          <div>{label}</div>
                                          <div className={locals.totalVolumes}>
                                            <div className={locals.volumeCategoriesGB}>{volumeGB} GB</div>
                                            <div className={locals.volumeCategoriesGB}>{volumeGB} RU</div>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    ))}
                                </div>
                              )}
                            </React.Fragment>
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
