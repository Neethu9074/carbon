/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';

import locals from './TwoValueBar.mless';

export default function TwoValueBar({
  v1,
  v2,
  v1Color,
  v2Color,
  v1Label,
  v2Label,
  renderLabels = true,
  formatter,
  fullDomain,
  rightToLeft = false,
  transformer
}) {
  if (v1 == null || v1 < 0) {
    return null;
  }
  fullDomain = fullDomain || v1 + v2;

  const widthEquation = transformer ? ((transformer(v1) / fullDomain) * 100) | 0 : ((v1 / fullDomain) * 100) | 0;
  const v1BarWidth = v1 == null ? '0%' : `${widthEquation}%`;

  return (
    <div className={locals.wrapper}>
      <div className={locals.bar} style={{ background: v2Color }}>
        <div
          className={classNames({
            [locals.fill]: true,
            [locals.rightToLeft]: rightToLeft,
            [locals.leftToRight]: !rightToLeft
          })}
          style={{ width: v1BarWidth, background: v1Color }}
        />
      </div>

      {renderLabels && (
        <div className={locals.values}>
          <span className={locals.value1}>
            {v1 != null ? formatter(v1) : valueMissingPlaceholder} {v1Label}
          </span>
          <span className={locals.value2}>
            {v2Label} {v1 != null ? formatter(v2) : valueMissingPlaceholder}
          </span>
        </div>
      )}
    </div>
  );
}
