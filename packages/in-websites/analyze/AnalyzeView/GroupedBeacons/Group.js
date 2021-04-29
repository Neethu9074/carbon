/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import { get } from 'lodash';
import React from 'react';

import MetricColumnCells from 'in-analyze/components/MetricColumn/MetricColumnCells';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';

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

          <Link className={locals.name} href={getGroupAsFilterUrl(name)}>
            {`${name}`}
          </Link>
        </div>
      </Td>

      <Td noWrap>{number.compact(get(item, ['metrics', 'beaconCount_SUM_Agg', 0, 1]))}</Td>

      <Td noWrap>{formatDateTime(item.earliestTimestamp)}</Td>

      <MetricColumnCells item={item} metrics={metrics} availableMetrics={availableMetrics} />
    </Tr>
  );
}
