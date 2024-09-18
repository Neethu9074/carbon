/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';

import locals from './SloTile.mless';

interface SloTileProps {
  title: string;
  value?: string;
  budget?: string;
  budgetTitle?: string;
  compact?: boolean;
  budgetSpent?: boolean;
}

export default function SloTile({ compact, title, value, budgetTitle, budget, budgetSpent }: SloTileProps) {
  const valuesPresent = value !== undefined && budget !== undefined;

  if (compact) {
    return (
      <div className={locals.oneRow}>
        <div className={locals.titleValueBorder}>
          <span>{title}:</span>
          <span
            className={classNames({
              [locals.value]: true,
              [locals.budgetAvailable]: valuesPresent && !budgetSpent,
              [locals.budgetSpent]: valuesPresent && budgetSpent
            })}
          >
            {value ?? valueMissingPlaceholder}
          </span>
        </div>
        <div className={locals.targetInfo}>
          <span>{budgetTitle}</span>
          <span className={locals.targetInfoValue}>{budget ?? valueMissingPlaceholder}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={locals.tile}>
      <div className={locals.title}>{title}</div>

      <div
        className={classNames({
          [locals.value]: true,
          [locals.budgetAvailable]: valuesPresent && !budgetSpent,
          [locals.budgetSpent]: valuesPresent && budgetSpent
        })}
      >
        <span>{value ?? valueMissingPlaceholder}</span>
      </div>

      {budgetTitle && (
        <div className={locals.targetInfo}>
          <span>{budgetTitle}</span> <span className={locals.leftSpace}>{budget ?? valueMissingPlaceholder}</span>
        </div>
      )}
    </div>
  );
}
