/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getHeatMapColor, { lightGreenToDarkGreenRgb } from 'in-services/heatMapColors';
import { rgbToHex } from 'in-services/formatters/color';
import { number } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';

import locals from './CountryList.mless';

export default connectTo(
  ({ data$, getValue }) => ({
    items: data$.map(result => {
      if (!result || !result.data) {
        return null;
      }
      return result.data.items
        .slice()
        .sort((a, b) => getValue(b) - getValue(a))
        .slice(0, 10);
    })
  }),
  function CountryList({ items, getValue }) {
    if (!items) {
      return null;
    }

    let min = null;
    let max = null;
    items.forEach(item => {
      const value = getValue(item);

      if (min == null) {
        min = value;
      } else {
        min = Math.min(min, value);
      }

      if (max == null) {
        max = value;
      } else {
        max = Math.max(max, value);
      }
    });

    return (
      <div className={locals.wrapper}>
        <ul className={locals.list}>
          {items.map(item => {
            const intensity = Math.max(1, getValue(item) - min) / Math.max(1, max - min);
            const color = getHeatMapColor(intensity, lightGreenToDarkGreenRgb);
            return (
              <li key={item.country} className={locals.listItem}>
                <span className={locals.countryName}>{item.country}:</span> {number.compact(getValue(item))}
                <div style={{ width: (getValue(item) / max) * 300 }} className={locals.barWrapper}>
                  <div
                    style={{ background: rgbToHex(color.r * 255, color.g * 255, color.b * 255) }}
                    className={locals.bar}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);
