import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { SloApName, SloTarget, SliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { twoDecimalPlaces, number } from 'in-services/formatters/number';
import SloTile from 'in-custom-dashboards/widgets/Slo/SloTile';
import { formatDateTime } from 'in-services/formatters/date';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import { getSliReport } from 'in-custom-dashboards/api';
import useObservable from 'in-hooks/useObservable';
import theme from 'in-themes';

import locals from './Widget.mless';
import useTimeConfig from 'in-hooks/useTimeConfig';

const GREEN = theme.lib.colors.green800;
const RED = theme.lib.colors.red800;
const DEFAULT_API = {
  getSliReport: (sliId, slo, from, to) => getSliReport(sliId, slo, from, to)
};

export default function Widget({ actions, config, title, dragHandle, api = DEFAULT_API }) {
  const target = config?.[SloTarget] ?? 0.99;
  const apName = config?.[SloApName] ?? '';
  const sliConfigId = config?.[SliConfigId] ?? 'phani-test-1';

  const timeConfig = useTimeConfig();
  timeConfig.to = timeConfig.to ?? new Date().getTime();

  const from = timeConfig.from ?? timeConfig.to - timeConfig.windowSize;
  const sliReport = useObservable(api.getSliReport(sliConfigId, target, from, timeConfig.to), [
    target,
    from,
    timeConfig.to
  ]);

  const { sli, slo, totalErrorBudget, errorBudgetRemaining, fromTimestamp, toTimestamp } = sliReport?.data ?? {};

  const sliColor = slo === null || sli === null ? '' : sli >= slo ? GREEN : RED;
  const errorBudgetSpent =
    errorBudgetRemaining === null || totalErrorBudget === null
      ? valueMissingPlaceholder
      : totalErrorBudget - errorBudgetRemaining;
  const budgetColor = !errorBudgetRemaining || !totalErrorBudget ? '' : errorBudgetRemaining > 0 ? GREEN : RED;

  return (
    <LightCardV2
      bodyClassName={locals.bodyNoPadding}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      title={title}
      headerClassName={locals.title}
      leftHeaderContent={<span className={locals.apName}>{apName ?? valueMissingPlaceholder}</span>}
    >
      <div className={locals.grid}>
        <div className={locals.col}>
          <SloTile
            title="Status"
            value={sli ? twoDecimalPlaces(100 * sli) : valueMissingPlaceholder}
            targetValue={slo ? twoDecimalPlaces(100 * slo) : valueMissingPlaceholder}
            color={sliColor}
            unit="%"
            targetInfo="Target:"
          />
        </div>
        <div className={locals.col}>
          <SloTile
            title="Error Budget Spent"
            value={number.compact(errorBudgetSpent)}
            targetValue={number.compact(totalErrorBudget) ?? valueMissingPlaceholder}
            color={budgetColor}
            unit="calls"
            targetInfo="Error Budget:"
          />
        </div>
        <div className={locals.col}>
          <SloTile
            title="Time Window"
            targetInfo="Dynamic time window"
            valuesClassName={locals.timeRangeValue}
            renderValue={() => (
              <div>
                from{' '}
                {fromTimestamp && (
                  <time dateTime={new Date(fromTimestamp).toISOString()}>{formatDateTime(fromTimestamp)}</time>
                )}
                <br />
                to{' '}
                {toTimestamp && (
                  <time dateTime={new Date(toTimestamp).toISOString()}>{formatDateTime(toTimestamp)}</time>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </LightCardV2>
  );
}
