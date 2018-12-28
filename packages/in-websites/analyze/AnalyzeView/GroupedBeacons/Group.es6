import { get, find } from 'lodash';
import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from './Group.mless';

export default function Group({ item, dotColor, showDot, getGroupAsFilterUrl, metrics, availableMetrics }) {
  const name = JSON.parse(item.name);
  return (
    <Tr size="compact">
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          {showDot && (
            <span className={locals.dot}>
              {dotColor ? (
                <div className={locals.rect} style={{ background: dotColor }} />
              ) : (
                <span className={locals.rectPlaceHolder} />
              )}
            </span>
          )}

          <Link className={locals.name} href$={getGroupAsFilterUrl(name)}>
            {name}
          </Link>
        </div>
      </Td>

      <Td noWrap>{number.compact(get(item, ['metrics', 'beaconCount_SUM_Agg', 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.earliestTimestamp)}</Td>

      {metrics.map(({ metric, aggregation }) => {
        const value = get(item, ['metrics', `${metric}_${aggregation}_Agg`, 0, 1]);
        let formatter = number.detailed;
        const metricDefinition = find(availableMetrics, m => m.metric === metric);
        if (metricDefinition) {
          formatter = metricDefinition.formatter.detailed;
        }

        return (
          <Td key={`${metric}_${aggregation}`} noWrap>
            <span className={locals.metricValue}>
              {value == null && 'N/A'}
              {value != null && formatter(value)}
            </span>
          </Td>
        );
      })}
    </Tr>
  );
}
