/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Td, Tr } from '@instana/components';
import { Link } from '@instana/components';

import { applicationsAlertingEventDetailsGoToAnalyze } from 'in-alerting/smart-alerts/applications/tracker';
import { formatDateTime } from 'in-services/formatters/date';
import unwrapLink from 'in-stores/navigation/unwrapLink';
import { number } from 'in-services/formatters/number';

import locals from 'in-events/components/AffectedEntities/AffectedEntity.mless';

export function AffectedEntity({ item, createItemLink, children }) {
  const { href, href$ } = unwrapLink(createItemLink(item));

  return (
    <Tr size="compact">
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          <Link onClick={() => applicationsAlertingEventDetailsGoToAnalyze()} href$={href$} href={href}>
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
  createItemLink: PropTypes.func,
  item: PropTypes.shape({
    metrics: PropTypes.shape({
      calls_SUM_Agg: PropTypes.any,
      totalCalls_SUM_Agg: PropTypes.any
    }),
    name: PropTypes.string.isRequired,
    timestamp: PropTypes.any
  }).isRequired
};
