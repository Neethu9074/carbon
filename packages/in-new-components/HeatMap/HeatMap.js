import { defaultProps, compose, renameProps } from 'recompose';
import { HeatMapCanvas } from '@nivo/heatmap';
import React from 'react';

import NivoChartTooltip from 'in-components/Chart/components/NivoChartTooltip';
import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import VerticalAxis, { WIDTH } from 'in-new-components/Axis/VerticalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { HEIGHT } from 'in-new-components/Axis/HorizontalAxis';
import { millis, number } from 'in-services/formatters/number';
import theme from 'in-themes';

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

function HeatMapImpl({ width, height, customWidth, customHeight, data, keys, timeConfig }) {
  if (!width || !data) {
    return <div style={{ height: customHeight || height }} className={locals.heatMap} />;
  }

  width = (customWidth || width) - WIDTH;
  height = (customHeight || height) - HEIGHT;

  return (
    <div className={locals.heatMap}>
      <VerticalAxis
        tickLineColor={theme.lib.colors.N700Medium}
        formatter={millis.fixed}
        scale={calculateScale(data)}
        height={height}
      />
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
          labelTextColor="rgba(255,255,255,0)"
          forceSquare={false}
          animate={false}
          hoverTarget="cell"
          cellOpacity={1}
          cellHoverOthersOpacity={0.75}
          tooltip={props => (
            <NivoChartTooltip {...props} id="Calls" aggregation={props.xKey} formatter={number.forcedCompact} />
          )}
        />
        <HorizontalTimeAxis
          tickLineColor={theme.lib.colors.N600Light}
          scale={{ from: timeConfig.to - timeConfig.windowSize, to: timeConfig.to }}
          width={width}
        />
      </div>
    </div>
  );
}

function calculateScale(data) {
  if (!data || data.length === 0) {
    return { from: 0, to: 0 };
  }
  return { from: data[data.length - 1].axisValue, to: data[0].axisValue };
}

// how to recalculate colors
// import { hexToRGBNormalized, rgbToHex } from 'in-services/formatters/color';
// import getHeatMapColor from 'in-services/heatMapColors';
// const HEAT_MAP_BASE_COLORS = [hexToRGBNormalized('#FBFCFD'), hexToRGBNormalized('#2473AE')];
// let HEAT_MAP_COLORS = [];
// for (let i = 0; i <= 100; i++) {
//   HEAT_MAP_COLORS[i] = getHeatMapColor(i / 100, HEAT_MAP_BASE_COLORS);
// }
// HEAT_MAP_COLORS = HEAT_MAP_COLORS.map(rgb => rgbToHex(rgb.r * 255, rgb.g * 255, rgb.b * 255));
// console.log(`"${HEAT_MAP_COLORS.join('","')}"`);

function getHeatMapColors() {
  return [
    '#fbfcfd',
    '#f8fafc',
    '#f6f9fb',
    '#f4f7fa',
    '#f2f6f9',
    '#f0f5f9',
    '#eef3f8',
    '#ebf2f7',
    '#e9f1f6',
    '#e7eff5',
    '#e5eef5',
    '#e3ecf4',
    '#e1ebf3',
    '#dfeaf2',
    '#dce8f1',
    '#dae7f1',
    '#d8e6f0',
    '#d6e4ef',
    '#d4e3ee',
    '#d2e1ed',
    '#d0e0ed',
    '#cddfec',
    '#cbddeb',
    '#c9dcea',
    '#c7dbea',
    '#c5d9e9',
    '#c3d8e8',
    '#c0d7e7',
    '#bed5e6',
    '#bcd4e6',
    '#bad2e5',
    '#b8d1e4',
    '#b6d0e3',
    '#b4cee2',
    '#b1cde2',
    '#afcce1',
    '#adcae0',
    '#abc9df',
    '#a9c7de',
    '#a7c6de',
    '#a4c5dd',
    '#a2c3dc',
    '#a0c2db',
    '#9ec1db',
    '#9cbfda',
    '#9abed9',
    '#98bcd8',
    '#95bbd7',
    '#93bad7',
    '#91b8d6',
    '#8fb7d5',
    '#8db6d4',
    '#8bb4d3',
    '#89b3d3',
    '#86b2d2',
    '#84b0d1',
    '#82afd0',
    '#80adcf',
    '#7eaccf',
    '#7cabce',
    '#7aa9cd',
    '#77a8cc',
    '#75a7cc',
    '#73a5cb',
    '#71a4ca',
    '#6fa2c9',
    '#6da1c8',
    '#6aa0c8',
    '#689ec7',
    '#669dc6',
    '#649cc5',
    '#629ac4',
    '#6099c4',
    '#5e97c3',
    '#5b96c2',
    '#5995c1',
    '#5793c0',
    '#5592c0',
    '#5391bf',
    '#518fbe',
    '#4f8ebd',
    '#4c8dbd',
    '#4a8bbc',
    '#488abb',
    '#4688ba',
    '#4487b9',
    '#4286b9',
    '#3f84b8',
    '#3d83b7',
    '#3b82b6',
    '#3980b5',
    '#377fb5',
    '#357db4',
    '#337cb3',
    '#307bb2',
    '#2e79b1',
    '#2c78b1',
    '#2a77b0',
    '#2875af',
    '#2674ae',
    '#2473ae'
  ];
}
