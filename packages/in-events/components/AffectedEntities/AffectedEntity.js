/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/applications/tracker';
import { Td, Tr } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from 'in-events/components/AffectedEntities/AffectedEntity.mless';

export function AffectedEntity({ item, createItemLink$, children }) {
  return (
    <Tr size="compact">
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          <Link onClick={() => applicationsAlertingEventDetailsGoToAnalyze()} href$={createItemLink$?.(item)}>
            {item.name}
          </Link>
        </div>
      </Td>
      <Td className={locals.labelCell} noWrap>
        {number.compact(item.metrics?.calls_SUM_Agg?.[0]?.[1])}
      </Td>
      <Td className={locals.labelCell} noWrap>
        {number.compact(item.metrics?.totalCalls_SUM_Agg?.[0]?.[1])}
      </Td>
      {children}
      <Td noWrap>{formatDateTime(item.timestamp)}</Td>
    </Tr>
  );
}

AffectedEntity.propTypes = {
  children: PropTypes.any,
  createItemLink$: PropTypes.func,
  item: PropTypes.shape({
    metrics: PropTypes.shape({
      calls_SUM_Agg: PropTypes.any,
      totalCalls_SUM_Agg: PropTypes.any
    }),
    name: PropTypes.string.isRequired,
    timestamp: PropTypes.any
  }).isRequired
};
