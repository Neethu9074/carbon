/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { capitalize } from 'lodash';
import classNames from 'classnames';
import React from 'react';

import { HorizontalIndicator, Li, LoadingSkeleton, SvgIcon, Tooltip, Ul } from '@instana/components';

import {
  ExpandedState,
  GroupProps,
  LogVolumeDetailsProps,
  MonthReportProps,
  RetentionPeriodsProps
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/types';
// eslint-disable-next-line no-restricted-imports
import { NDash, refineRetentionPeriodData, sortMonths } from './utils';
import { bytesToLargerUnit, getMonthName } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { LogVolumeUsageItem, RetentionPeriod } from 'in-logging/api/logVolume';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './LogVolumeDetails.mless';

export default function LogVolumeDetails({ data, timePeriod, progress, groupingTag }: LogVolumeDetailsProps) {
  const { loading: isLoading } = progress;
  const [expanded, setIsExpanded] = React.useState<Record<string, boolean>>({});

  const expandedState: ExpandedState = {
    handleToggle: key => {
      setIsExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    },
    expanded
  };

  if (isLoading || !data) {
    return <Skeletons lines={timePeriod} />;
  }

  return (
    <>
      {sortMonths(data)
        .slice(0, timePeriod)
        .map((item: LogVolumeUsageItem, index: number) => {
          const { numberOfMonth, logVolume, retentionPeriods } = item;
          return (
            <MonthReport
              groupingTag={groupingTag}
              expandedState={expandedState}
              key={`${numberOfMonth}_${index}`}
              numberOfMonth={numberOfMonth}
              logVolume={logVolume}
              retentionPeriods={retentionPeriods}
            />
          );
        })}
    </>
  );
}

export function Skeletons({ lines }: { lines: number }) {
  return (
    <div>
      {Array(lines)
        .fill(null)
        .map((_, i) => (
          <div key={i} className={locals.loadingMock}>
            <HorizontalIndicator className={locals.loadingIndicator} progress={indeterminateProgress} />
            <LoadingSkeleton className={locals.skeleton} />
          </div>
        ))}
    </div>
  );
}

function MonthReport({ expandedState, logVolume, numberOfMonth, retentionPeriods, groupingTag }: MonthReportProps) {
  const { amount, localizedUnit } = bytesToLargerUnit(logVolume, 2);

  const refinedRetentionPeriodData = refineRetentionPeriodData(retentionPeriods);

  if (refinedRetentionPeriodData.length === 0) {
    return null;
  }

  return (
    <div className={locals.LogVolumeDetailsContainer}>
      <Li className={locals.LogVolumeDetails}>
        <div className={locals.tableLabel}>
          <span>{t('in-settings:maintenanceWindow.months', { context: getMonthName(numberOfMonth) })}</span>
        </div>
        <div className={locals.tableGB}>
          <span>
            {amount} {localizedUnit}
          </span>
        </div>
      </Li>
      <RetentionPeriods
        groupingTag={groupingTag}
        expandedState={expandedState}
        retentionPeriods={refinedRetentionPeriodData}
      />
    </div>
  );
}

function RetentionPeriods({ retentionPeriods, expandedState, groupingTag }: RetentionPeriodsProps) {
  return (
    <Ul>
      {retentionPeriods.map(({ retentionDays, logVolume, logVolumeGroups }: RetentionPeriod, index) => {
        const key = `${retentionDays}-${index}`;
        const isExpanded = expandedState.expanded[key];
        const hasGroups = logVolumeGroups?.length > 0;

        const { amount, localizedUnit } = bytesToLargerUnit(logVolume, 2);

        return (
          <Li key={key} className={locals.retentionPeriod} noAlternatingBg>
            <section
              onClick={hasGroups ? () => expandedState.handleToggle(key) : undefined}
              className={classNames(hasGroups && locals.retentionPeriodWithGroups)}
            >
              <div className={locals.retentionDays}>
                <span className={locals.tableLabel}>
                  {t('in-settings:tabs.logVolume.days', { context: String(retentionDays) })}
                </span>
                <span className={locals.tableGB}>
                  {amount} {localizedUnit}
                </span>
                {hasGroups && <SvgIcon type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="s" />}
              </div>
            </section>
            {isExpanded && (
              <section>
                {logVolumeGroups?.map(props => (
                  <Group groupingTag={groupingTag} {...props} />
                ))}
              </section>
            )}
          </Li>
        );
      })}
    </Ul>
  );
}

function Group({ label, logVolume, groupingTag }: GroupProps) {
  const { amount, localizedUnit } = bytesToLargerUnit(logVolume, 2);

  const wrapInTooltip = (el: JSX.Element) => (
    <Tooltip
      content={t('in-settings:tabs.logVolume.groupingTagTootip', {
        groupingTag: groupingTag && capitalize(groupingTag)
      })}
      align="mousePosition"
    >
      {el}
    </Tooltip>
  );
  const hasNoLabel = label === '';
  const labelText = hasNoLabel ? NDash : label;
  const Label = <span className={locals.tableLabel}>{labelText}</span>;

  return (
    <div key={label} className={locals.logVolumeCategories}>
      {hasNoLabel ? wrapInTooltip(Label) : Label}
      <span className={locals.tableGB}>
        {amount} {localizedUnit}
      </span>
    </div>
  );
}
