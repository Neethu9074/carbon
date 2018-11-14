import React from 'react';

import { heatMapColorScaleRgb } from 'in-new-components/GlobeView/components/heatMapConfig';
import getHeatMapColor from 'in-services/heatMapColors';
import { rgbToHex } from 'in-services/formatters/color';
import connectTo from 'in-hoc/connectTo';

import locals from './CountryList.mless';

export default connectTo(
  props => ({
    items: props.getData$().map(result => {
      if (!result || !result.data) {
        return null;
      }
      return result.data.items
        .slice()
        .sort((a, b) => b.pageLoads - a.pageLoads)
        .slice(0, 10);
    })
  }),
  function CountryList({ items }) {
    if (!items) {
      return null;
    }

    const maxCount = items.map(t => t.pageLoads).reduce((a, b) => (a > b ? a : b), 0);

    return (
      <div className={locals.wrapper}>
        <ul className={locals.list}>
          {items.map(item => {
            const color = getHeatMapColor(item.pageLoads / maxCount, heatMapColorScaleRgb);
            return (
              <li key={item.country} className={locals.listItem}>
                {item.country}
                {` (${item.pageLoads})`}
                <div style={{ width: (item.pageLoads / maxCount) * 300 }} className={locals.barWrapper}>
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
