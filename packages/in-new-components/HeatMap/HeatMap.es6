import { defaultProps, compose, renameProps } from 'recompose';
import { HeatMapCanvas } from '@nivo/heatmap';
import React from 'react';

import getElementDimensions from 'in-hoc/getElementDimensions';

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

function HeatMapImpl({ width, height, customWidth, customHeight, data, keys }) {
  if (!width || !data) {
    return <div style={{ height: customHeight || height }} className={locals.heatMap} />;
  }

  const keyMap = new Map();
  for (let i = 0; i < keys.length; i++) {
    keyMap.set(keys[i], i);
  }

  return (
    <div className={locals.heatMap}>
      <HeatMapCanvas
        height={customHeight || height}
        width={customWidth || width}
        data={data}
        keys={keys}
        indexBy="key"
        colors={getHeatMapColors()}
        margin={{
          top: 0,
          right: 0,
          bottom: 60,
          left: 60
        }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 3,
          tickPadding: 2,
          legendPosition: 'center',
          // since nivo does not allow
          format: tick => (isTickWhichShouldBeHidden(tick, keyMap) ? '' : tick)
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'center'
        }}
        labelTextColor="#ffffff00"
        forceSquare={false}
        animate={false}
        hoverTarget="rowColumn"
        cellOpacity={1}
        cellHoverOthersOpacity={0.5}
      />
    </div>
  );
}

function isTickWhichShouldBeHidden(tick, keyMap) {
  const totalColumns = keyMap.size;
  const numTicks = 6;
  const allowTicksAtIndexTimes = Math.ceil(totalColumns / numTicks);

  const tickIndex = keyMap.get(tick);
  if (tickIndex % allowTicksAtIndexTimes === 0) {
    return false;
  }
  return true;
}

// how to recalculate colors
// import { hexToRGBNormalized, rgbToHex } from 'in-services/formatters/color';
// import getHeatMapColor from 'in-services/heatMapColors';
// const HEAT_MAP_BASE_COLORS = [
//   hexToRGBNormalized('#073568'),
//   hexToRGBNormalized('#5fa5cc'),
//   hexToRGBNormalized('#e7dfda'),
//   hexToRGBNormalized('#d15648'),
//   hexToRGBNormalized('#710320')
// ];
// let HEAT_MAP_COLORS = [];
// for (let i = 0; i < 100; i++) {
//   HEAT_MAP_COLORS[i] = getHeatMapColor(null, i / 100, HEAT_MAP_BASE_COLORS);
// }
// HEAT_MAP_COLORS = HEAT_MAP_COLORS.map(rgb => rgbToHex(rgb.r * 255, rgb.g * 255, rgb.b * 255));
// console.log(`"${HEAT_MAP_COLORS.join('","')}"`);

function getHeatMapColors() {
  return [
    '#073568',
    '#0a396c',
    '#0e3d70',
    '#114274',
    '#154678',
    '#184b7c',
    '#1c4f80',
    '#1f5484',
    '#235888',
    '#265d8c',
    '#2a6190',
    '#2d6694',
    '#316a98',
    '#346f9c',
    '#3873a0',
    '#3b78a4',
    '#3f7ca8',
    '#4281ac',
    '#4685b0',
    '#498ab4',
    '#4d8eb8',
    '#5093bc',
    '#5497c0',
    '#579cc4',
    '#5ba0c8',
    '#5fa5cc',
    '#64a7cc',
    '#69a9cd',
    '#6fabcd',
    '#74aece',
    '#7ab0ce',
    '#7fb2cf',
    '#85b5cf',
    '#8ab7d0',
    '#8fb9d1',
    '#95bcd1',
    '#9abed2',
    '#a0c0d2',
    '#a5c3d3',
    '#abc5d3',
    '#b0c7d4',
    '#b6cad4',
    '#bbccd5',
    '#c0ced6',
    '#c6d1d6',
    '#cbd3d7',
    '#d1d5d7',
    '#d6d8d8',
    '#dcdad8',
    '#e1dcd9',
    '#e7dfda',
    '#e6d9d4',
    '#e5d4ce',
    '#e4cec8',
    '#e3c9c2',
    '#e2c3bc',
    '#e1beb6',
    '#e0b8b1',
    '#dfb3ab',
    '#dfada5',
    '#dea89f',
    '#dda299',
    '#dc9d93',
    '#db978e',
    '#da9288',
    '#d98c82',
    '#d8877c',
    '#d88176',
    '#d77c70',
    '#d6766b',
    '#d57165',
    '#d46b5f',
    '#d36659',
    '#d26053',
    '#d15b4d',
    '#d15648',
    '#cd5246',
    '#c94f44',
    '#c54c43',
    '#c14841',
    '#bd4540',
    '#b9423e',
    '#b63e3c',
    '#b23b3b',
    '#ae3839',
    '#aa3438',
    '#a63136',
    '#a22e34',
    '#9f2a33',
    '#9b2731',
    '#972430',
    '#93202e',
    '#8f1d2c',
    '#8b1a2b',
    '#881629',
    '#841328',
    '#801026',
    '#7c0c24',
    '#780923',
    '#740621'
  ];
}
