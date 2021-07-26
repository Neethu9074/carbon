/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import locals from './Funnel.mless';

/**
 * The Activation & Adoption funnel.
 * Renders a narrowing funnel with tiles that are passed in.
 * @param {array} tiles The tiles to be rendered in the funnel, from left to right.
 * @param {object} accountInfo The retrieved account information.
 */
export default function Funnel({ tiles, accountInfo }) {
  return (
    <div className={locals.container}>
      {tiles.map((tile, index) => (
        <tile.Renderer key={index} {...tile} accountInfo={accountInfo} position={index} />
      ))}
    </div>
  );
}
