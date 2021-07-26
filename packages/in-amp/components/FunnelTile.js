/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import locals from './FunnelTile.mless';

/**
 * A tile within the funnel.
 * Has a title and content that is passed in.
 * Whether the tile has the first or second position within the funnel, its design changes.
 * @param {node} children The content of the tile.
 * @param {number} position The position of the tile in the funnel, from the left.
 * @param {string} title The title on top of the funnel.
 * @param {string} backgroundColor The background color of the tile.
 */
export default function FunnelTile({ children, position, title, backgroundColor }) {
  return (
    <div className={position === 0 ? locals.tile_0 : locals.tile_1} style={{ backgroundColor }}>
      <div className={locals.tileContainer}>
        <h3 className={position === 0 ? locals.tileHeader_0 : locals.tileHeader_1}>{title}</h3>
      </div>
      <div className={position === 0 ? locals.tileInner_0 : locals.tileInner_1}>
        <div className={locals.tileContent}>{children}</div>
      </div>
    </div>
  );
}
