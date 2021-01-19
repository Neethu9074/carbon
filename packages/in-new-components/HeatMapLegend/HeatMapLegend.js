/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './HeatMapLegend.mless';

export default function HeatMapLegend({ className, valueFrom, colorFrom, valueTo, colorTo, light }) {
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [className]: className
      })}
    >
      <div
        className={classNames({
          [locals.values]: true,
          [locals.light]: light
        })}
      >
        <span>{valueFrom}</span>
        <span>{valueTo}</span>
      </div>
      <div
        style={{ backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})` }}
        className={locals.colors}
      />
    </div>
  );
}
