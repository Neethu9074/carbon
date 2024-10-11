/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '@instana/components';
import { Td, Tr } from '@instana/legacy';

import { APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { formatDateTime } from 'in-services/formatters/date';
import unwrapLink from 'in-stores/navigation/unwrapLink';
import { number } from 'in-services/formatters/number';

import locals from 'in-events/components/AffectedEntities/AffectedEntity.mless';

export function AffectedEntity({ item, createItemLink, children }) {
  const { href, href$ } = unwrapLink(createItemLink(item));
  const { trackCta } = useSegmentTracking();

  const carbonRow = {
    id: item.name,
    name: (
      <div className={locals.cell}>
        <Link onClick={() => trackCta(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE)} href={href$ ?? href}>
          {item.name}
        </Link>
      </div>
    ),
    calls: <span className={locals.labelCell}>{number.compact(item.metrics?.calls_SUM_Agg?.[0]?.[1])}</span>,
    totalCalls: <span className={locals.labelCell}>{number.compact(item.metrics?.totalCalls_SUM_Agg?.[0]?.[1])}</span>,
    timestamp: <span>{formatDateTime(item.timestamp)}</span>
  };

  if (carbonTableEnabled) {
    return carbonRow;
  }

  return (
    <Tr size="compact">
      <Td className={locals.labelCell} ellipsis="50vw">
        <div className={locals.cell}>
          <Link onClick={() => trackCta(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE)} href={href$ ?? href}>
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
