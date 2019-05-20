import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './HeatMapLegend.mless';

export default function HeatMapLegend({ className, valueFrom, colorFrom, valueTo, colorTo, light }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [className]: className
      })}
    >
      <div
        className={evaluateClassNames({
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
