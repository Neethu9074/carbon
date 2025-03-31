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
  companionValue?: string;
  companionTitle?: string;
  compact?: boolean;
  spent?: boolean;
}

export default function SloTile({ compact, title, value, companionTitle, companionValue, spent }: SloTileProps) {
  const valuesPresent = value !== undefined && companionValue !== undefined;

  if (compact) {
    return (
      <div className={locals.oneRow}>
        <div className={locals.titleValueBorder}>
          <span>{title}:</span>
          <span
            className={classNames({
              [locals.value]: true,
              [locals.budgetAvailable]: valuesPresent && !spent,
              [locals.budgetSpent]: valuesPresent && spent
            })}
          >
            {value ?? valueMissingPlaceholder}
          </span>
        </div>
        <div className={locals.targetInfo}>
          <span>{spent}</span>
          <span className={locals.targetInfoValue}>{companionValue ?? valueMissingPlaceholder}</span>
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
          [locals.budgetAvailable]: valuesPresent && !spent,
          [locals.budgetSpent]: valuesPresent && spent
        })}
      >
        <span>{value ?? valueMissingPlaceholder}</span>
      </div>

      {companionTitle && (
        <div className={locals.targetInfo}>
          <span>{companionTitle}</span>{' '}
          <span className={locals.leftSpace}>{companionValue ?? valueMissingPlaceholder}</span>
        </div>
      )}
    </div>
  );
}
