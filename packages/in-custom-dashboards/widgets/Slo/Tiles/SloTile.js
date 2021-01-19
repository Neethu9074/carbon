/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import TileWrapper from 'in-custom-dashboards/widgets/Slo/Tiles/TileWrapper';

import locals from './SloTile.mless';

export default function SloTile({
  title,
  value,
  color,
  actions,
  targetInfo,
  targetValue,
  useMaxAvailableHeight = true
}) {
  return (
    <TileWrapper useMaxAvailableHeight={useMaxAvailableHeight} actions={actions}>
      <div className={locals.title}>{title}</div>

      <div className={locals.value} style={{ color: color }}>
        <span>{value}</span>
      </div>

      <div className={locals.targetInfo}>
        <span>{targetInfo}</span> <span className={locals.leftSpace}>{targetValue}</span>
      </div>
    </TileWrapper>
  );
}

SloTile.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  actions: PropTypes.node,
  targetInfo: PropTypes.string.isRequired,
  targetValue: PropTypes.string.isRequired,
  color: PropTypes.string,
  useMaxAvailableHeight: PropTypes.bool
};
