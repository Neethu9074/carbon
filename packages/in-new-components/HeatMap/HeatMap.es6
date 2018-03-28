import { defaultProps, compose, renameProps } from 'recompose';
import { HeatMapCanvas } from '@nivo/heatmap';
import React from 'react';

import VerticalAxisPlaceholder from 'in-new-components/Axis/VerticalAxisPlaceholder';
import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';

import locals from './HeatMap.mless';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  getElementDimensions,
  defaultProps({
    customHeight: 300
  })
)(HeatMapImpl);

function HeatMapImpl({ width, height, customWidth, customHeight, data, keys, timeframe }) {
  if (!width || !data) {
    return <div style={{ height: customHeight || height }} className={locals.heatMap} />;
  }

  width = (customWidth || width) - 60;
  height = (customHeight || height) - 30;

  return (
    <div className={locals.heatMap}>
      <VerticalAxis formatter={millis} scale={{ from: data[data.length - 1].key, to: data[0].key }} height={height} />
      <div>
        <HeatMapCanvas
          height={height}
          width={width}
          data={data}
          keys={keys}
          indexBy="key"
          colors={getHeatMapColors()}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
          labelTextColor="#ffffff00"
          forceSquare={false}
          animate={false}
          hoverTarget="cell"
          cellOpacity={1}
          cellHoverOthersOpacity={0.75}
        />
        <HorizontalTimeAxis scale={{ from: timeframe.to - timeframe.windowSize, to: timeframe.to }} width={width} />
      </div>
      <VerticalAxisPlaceholder />
    </div>
  );
}

// how to recalculate colors
// import { hexToRGBNormalized, rgbToHex } from 'in-services/formatters/color';
// import getHeatMapColor from 'in-services/heatMapColors';
// const HEAT_MAP_BASE_COLORS = [hexToRGBNormalized('#dff2ff'), hexToRGBNormalized('#082366')];
// let HEAT_MAP_COLORS = [];
// for (let i = 0; i <= 100; i++) {
//   HEAT_MAP_COLORS[i] = getHeatMapColor(null, i / 100, HEAT_MAP_BASE_COLORS);
// }
// HEAT_MAP_COLORS = HEAT_MAP_COLORS.map(rgb => rgbToHex(rgb.r * 255, rgb.g * 255, rgb.b * 255));
// console.log(`"${HEAT_MAP_COLORS.join('","')}"`);

function getHeatMapColors() {
  return [
    '#fff',
    '#dceffd',
    '#daedfb',
    '#d8ebfa',
    '#d6e9f8',
    '#d4e7f7',
    '#d2e5f5',
    '#cfe3f4',
    '#cde1f2',
    '#cbdff1',
    '#c9ddef',
    '#c7dbee',
    '#c5d9ec',
    '#c3d7eb',
    '#c0d5e9',
    '#bed2e8',
    '#bcd0e6',
    '#bacee4',
    '#b8cce3',
    '#b6cae1',
    '#b3c8e0',
    '#b1c6de',
    '#afc4dd',
    '#adc2db',
    '#abc0da',
    '#a9bed8',
    '#a7bcd7',
    '#a4bad5',
    '#a2b8d4',
    '#a0b5d2',
    '#9eb3d1',
    '#9cb1cf',
    '#9aafce',
    '#98adcc',
    '#95abca',
    '#93a9c9',
    '#91a7c7',
    '#8fa5c6',
    '#8da3c4',
    '#8ba1c3',
    '#899fc1',
    '#869dc0',
    '#849bbe',
    '#8298bd',
    '#8096bb',
    '#7e94ba',
    '#7c92b8',
    '#7990b7',
    '#778eb5',
    '#758cb4',
    '#738ab2',
    '#7188b0',
    '#6f86af',
    '#6d84ad',
    '#6a82ac',
    '#6880aa',
    '#667ea9',
    '#647ca7',
    '#6279a6',
    '#6077a4',
    '#5e75a3',
    '#5b73a1',
    '#5971a0',
    '#576f9e',
    '#556d9d',
    '#536b9b',
    '#51699a',
    '#4e6798',
    '#4c6596',
    '#4a6395',
    '#486193',
    '#465f92',
    '#445c90',
    '#425a8f',
    '#3f588d',
    '#3d568c',
    '#3b548a',
    '#395289',
    '#375087',
    '#354e86',
    '#324c84',
    '#304a83',
    '#2e4881',
    '#2c4680',
    '#2a447e',
    '#28427c',
    '#263f7b',
    '#233d79',
    '#213b78',
    '#1f3976',
    '#1d3775',
    '#1b3573',
    '#193372',
    '#173170',
    '#142f6f',
    '#122d6d',
    '#102b6c',
    '#0e296a',
    '#0c2769',
    '#0a2567',
    '#082366'
  ];
}
