/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';

import locals from './SloTile.mless';

interface SloTileProps {
  title: string;
  value?: string | number;
  targetValue?: string | number;
  targetInfo: string;
  color?: string;
  smallRowStyle?: boolean;
}

export default function SloTile({ smallRowStyle, title, value, color, targetInfo, targetValue }: SloTileProps) {
  if (smallRowStyle) {
    return (
      <div className={locals.oneRow}>
        <div className={locals.titleValueBorder}>
          <span>{title}:</span>
          <span className={locals.value} style={{ color }}>
            {value || valueMissingPlaceholder}
          </span>
        </div>
        <div className={locals.targetInfo}>
          <span>{targetInfo}</span>
          <span className={locals.targetInfoValue}>{targetValue || valueMissingPlaceholder}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={locals.tile}>
      <div className={locals.title}>{title}</div>

      <div className={locals.value} style={{ color }}>
        <span>{value || valueMissingPlaceholder}</span>
      </div>

      <div className={locals.targetInfo}>
        <span>{targetInfo}</span> <span className={locals.leftSpace}>{targetValue || valueMissingPlaceholder}</span>
      </div>
    </div>
  );
}
