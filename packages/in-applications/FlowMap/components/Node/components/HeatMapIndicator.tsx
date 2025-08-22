/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from 'in-applications/FlowMap/components/Node/components/HeatMapIndicator.mless';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HeatMapIndicator {
  heatMapColor: RGB;
}

export default function HeatMapIndicator({ heatMapColor }: HeatMapIndicator) {
  if (!heatMapColor) {
    return null;
  }

  const background =
    heatMapColor &&
    `rgba(${(heatMapColor.r * 255) | 0}, ${(heatMapColor.g * 255) | 0}, ${(heatMapColor.b * 255) | 0}, 1.0)`;

  return <div style={{ background }} className={locals.heatMapIndicator} />;
}
