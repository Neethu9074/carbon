import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { sloApName, sloTarget } from 'in-custom-dashboards/widgets/Slo/form';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import SloTile from 'in-custom-dashboards/widgets/Slo/SloTile';
import { formatDateTime } from 'in-services/formatters/date';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import { getSliReport } from 'in-custom-dashboards/api';
import useObservable from 'in-hooks/useObservable';
import theme from 'in-themes';

import locals from './Widget.mless';

const GREEN = theme.lib.colors.green800;
const RED = theme.lib.colors.red800;

export default function Widget({ actions, config, title, dragHandle }) {
  const target = config?.[sloTarget] ?? 99;
  const apName = config?.[sloApName] ?? '';

  const sliReport = useObservable(getSliReport('phani-test-1', target), [target, apName]);

  const { sli, slo, totalErrorBudget, errorBudgetRemaining, fromTimestamp, toTimestamp } = sliReport?.data ?? {};

  const sliColor = !slo || !sli ? '' : slo >= sli ? GREEN : RED;
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
      title={title ?? ' '}
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
            value={errorBudgetRemaining ?? valueMissingPlaceholder}
            targetValue={totalErrorBudget ?? valueMissingPlaceholder}
            color={budgetColor}
            unit="calls"
            targetInfo="Error Budget:"
          />
        </div>
        <div className={locals.col}>
          <SloTile
            title="Time Window"
            targetInfo="Fixed time intervall"
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
