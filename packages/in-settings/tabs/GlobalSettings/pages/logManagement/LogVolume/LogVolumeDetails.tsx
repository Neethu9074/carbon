/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { HorizontalIndicator, Li, LoadingSkeleton, Ul, SvgIcon, Tooltip } from '@instana/components';

import {
  LogVolumeData,
  LogVolumeDetailsProps,
  VolumeUnits
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/types';
// eslint-disable-next-line no-restricted-imports
import { generateEmptyData, NDash } from './utils';
import { capitalize } from 'in-services/formatters/string';
import { t } from 'in-i18n';

import locals from './LogVolumeDetails.mless';

export default function LogVolumeDetails({
  data,
  progress,
  timePeriod,
  expandedRetention,
  groupingTag,
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
        ?.filter(({ totalVolume }: LogVolumeData) => totalVolume.gb > 0)
        .map((item: LogVolumeData, index: number) => {
          const { month, totalVolume, retentionPeriods } = item;
          const hasPartialSums = 'partialSums' in item;
          const partialSums = hasPartialSums ? item.partialSums : null;

          return isLoading ? (
            <div key={`${month}_${index}`} className={locals.loadingMock}>
              <HorizontalIndicator className={locals.loadingIndicator} progress={progress} />
              <LoadingSkeleton className={locals.skeleton} />
            </div>
          ) : (
            <div key={`${month}_${index}`} className={locals.LogVolumeDetailsContainer}>
              <Li className={locals.LogVolumeDetails}>
                <div className={locals.tableLabel}>
                  <span>{t('in-settings:maintenanceWindow.months', { context: month })}</span>
                </div>
                <div className={locals.tableGB}>
                  <span>{totalVolume.gb} GB</span>
                </div>
              </Li>
              <div>
                <Ul className={locals.logVolumeItems}>
                  {!hasPartialSums ? (
                    <Ul className={locals.logVolumeItems}>
                      {(['days30', 'days60', 'days90'] as const)
                        .filter(days => {
                          const period = retentionPeriods[days];
                          return Array.isArray(period) ? period.length > 0 : period.gb > 0;
                        })
                        .map((days, index: number) => (
                          <Li key={`${days}_${index}`}>
                            <div className={locals.retentionDays}>
                              <span className={locals.tableLabel}>
                                {t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}
                              </span>
                              <span className={locals.tableGB}>{(retentionPeriods[days] as VolumeUnits).gb} GB</span>
                            </div>
                          </Li>
                        ))}
                    </Ul>
                  ) : (
                    <div data-testid="groupingDropdown">
                      <Ul className={locals.logVolumeItems}>
                        {(['days30', 'days60', 'days90'] as const)
                          .filter(days => retentionPeriods[days] && partialSums && partialSums[days].gb > 0)
                          .map((days, index) => (
                            <React.Fragment key={`${days}_${index}`}>
                              <Li onClick={() => handleToggle(month, days)} className={locals.retentionDays}>
                                <span className={locals.tableLabel}>
                                  {t('in-settings:tabs.logVolume.days', { context: days.replace('days', '') })}
                                </span>
                                <span className={locals.tableGB}>{partialSums && partialSums[days].gb} GB</span>
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
                              </Li>

                              {expandedRetention[`${month}_${days}`] && (
                                <div>
                                  {(retentionPeriods[days] as { label: string; volumeGB: number }[])
                                    ?.filter((item: { label: string; volumeGB: number }) => item.volumeGB > 0)
                                    .map(({ label, volumeGB }, index: number) => (
                                      <React.Fragment key={`${days}_${index}`}>
                                        <div key={label + index} className={locals.logVolumeCategories}>
                                          {label === NDash ? (
                                            <Tooltip
                                              content={t('in-settings:tabs.logVolume.groupingTagTootip', {
                                                groupingTag: groupingTag && capitalize(groupingTag)
                                              })}
                                              align="mousePosition"
                                            >
                                              <span className={locals.tableLabel}>{label}</span>
                                            </Tooltip>
                                          ) : (
                                            <span className={locals.tableLabel}>{label}</span>
                                          )}
                                          <span className={locals.tableGB}>{volumeGB} GB</span>
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
