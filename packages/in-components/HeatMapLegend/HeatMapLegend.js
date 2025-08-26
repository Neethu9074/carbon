/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './HeatMapLegend.mless';

export default function HeatMapLegend({ className, valueFrom, colorFrom, valueTo, colorTo, light, label }) {
  return (
    <div className={classNames(locals.wrapper, className)}>
      {label && <span className={locals.label}>{label}</span>}
      <div
        style={{ backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})` }}
        className={locals.colors}
      />
      <div
        className={classNames(locals.values, {
          [locals.light]: light
        })}
      >
        <span>{valueFrom}</span>
        <span>{valueTo}</span>
      </div>
    </div>
  );
}
