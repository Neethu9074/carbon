/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { formatDateTime, formatDateShort, formatTimeWithoutSeconds } from 'in-services/formatters/date';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Trans } from 'in-i18n';

import locals from './SloTile.mless';

export default function SloTimeTile({ smallRowStyle, title, fromTimestamp, toTimestamp, color, info }) {
  if (smallRowStyle) {
    return (
      <div className={locals.oneRow}>
        <div style={{ color }} className={locals.titleValue}>
          <span>{info}:</span>
          <span className={locals.value}>
            <CompactFromToDates from={fromTimestamp} to={toTimestamp} />
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className={locals.tile}>
      <div className={locals.title}>{title}</div>

      <div style={{ color }} className={locals.value}>
        <div className={locals.timeRangeValue}>
          <Trans
            i18nKey="in-custom-dashboards:widgets.slo.sloTimeTile.sloTime"
            components={{
              'datetime-from': <DateTime timeStamp={fromTimestamp} />,
              'datetime-to': <DateTime timeStamp={toTimestamp} />
            }}
          />
        </div>
      </div>

      <div className={locals.targetInfo}>{info}</div>
    </div>
  );
}

function DateTime({ timeStamp }) {
  return timeStamp && <time dateTime={new Date(timeStamp).toISOString()}>{formatDateTime(timeStamp)}</time>;
}

export function compactTimeInterval(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();
  const sameYear = fromYear === toYear;
  const fromStr = fmt(from, '');
  const toStr = fmt(to, !sameYear ? '' : ', ' + toYear);
  return { fromStr, toStr };
}

function CompactFromToDates({ from, to }) {
  if (!from && !to) {
    return valueMissingPlaceholder;
  }
  if (from && to) {
    const { fromStr, toStr } = compactTimeInterval(from, to);
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return (
      <>
        {from && <time dateTime={fromDate.toISOString()}>{fromStr}</time>}
        {' – '}
        {to && <time dateTime={toDate.toISOString()}>{toStr}</time>}
      </>
    );
  }
  return (
    <>
      {from && <time dateTime={new Date(from).toISOString()}>{formatDateTime(from)}</time>}
      {' – '}
      {to && <time dateTime={new Date(to).toISOString()}>{formatDateTime(to)}</time>}
    </>
  );
}

function fmt(timestamp, appendYear) {
  return `${formatDateShort(timestamp)}${appendYear} ${formatTimeWithoutSeconds(timestamp)}`;
}

SloTimeTile.propTypes = {
  smallRowStyle: PropTypes.bool,
  title: PropTypes.string,
  fromTimestamp: PropTypes.number,
  toTimestamp: PropTypes.number,
  info: PropTypes.string.isRequired,
  color: PropTypes.string
};
