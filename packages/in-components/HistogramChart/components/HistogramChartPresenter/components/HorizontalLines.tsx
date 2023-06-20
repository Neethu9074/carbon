/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import locals from './HorizontalLines.mless';

interface HorizontalLinesProps {
  nbBars: number;
  height: number;
  width: number;
  style: React.CSSProperties;
}

export default function HorizontalLines({ nbBars, height, width, style }: HorizontalLinesProps) {
  const horizontalLineHeight = height / nbBars;

  const rows = Array.from({ length: nbBars }, (_, i) => (
    <div key={i} className={locals.horizontalLine} style={{ height: horizontalLineHeight, width }} />
  ));

  return (
    <div className={locals.lines} style={style}>
      {rows}
    </div>
  );
}
