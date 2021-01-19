/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import TileWrapper from 'in-custom-dashboards/widgets/Slo/Tiles/TileWrapper';
import { formatDateTime } from 'in-services/formatters/date';

import locals from './SloTile.mless';

export default function SloTimeTile({
  title,
  fromTimestamp,
  toTimestamp,
  color,
  actions,
  valuesClassName,
  info,
  useMaxAvailableHeight = true
}) {
  return (
    <TileWrapper useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
      <div className={locals.title}>{title}</div>

      <div style={{ color: color }} className={locals.value}>
        <span className={valuesClassName}>
          <div>
            from{' '}
            {fromTimestamp && (
              <time dateTime={new Date(fromTimestamp).toISOString()}>{formatDateTime(fromTimestamp)}</time>
            )}
            <br />
            to{' '}
            {toTimestamp && <time dateTime={new Date(toTimestamp).toISOString()}>{formatDateTime(toTimestamp)}</time>}
          </div>
        </span>
      </div>

      <div className={locals.targetInfo}>
        <span>{info}</span>
      </div>
    </TileWrapper>
  );
}

SloTimeTile.propTypes = {
  title: PropTypes.string,
  fromTimestamp: PropTypes.number.isRequired,
  toTimestamp: PropTypes.number.isRequired,
  actions: PropTypes.node,
  info: PropTypes.string.isRequired,
  valuesClassName: PropTypes.string,
  color: PropTypes.string,
  useMaxAvailableHeight: PropTypes.bool
};
