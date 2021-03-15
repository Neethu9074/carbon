/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './HeatMapIndicator.mless';

export default function HeatMapIndicator({ heatMapColor }) {
  if (!heatMapColor) {
    return null;
  }

  heatMapColor =
    heatMapColor &&
    `rgba(${(heatMapColor.r * 255) | 0}, ${(heatMapColor.g * 255) | 0}, ${(heatMapColor.b * 255) | 0}, 1.0)`;

  return <div style={{ background: heatMapColor }} className={locals.heatMapIndicator} />;
}
