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
          tickRotation: -90
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'center'
        }}
        cellOpacity={1}
        cellBorderColor="inherit:darker(0.4)"
        labelTextColor="#ffffff00"
        defs={[
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(0, 0, 0, 0.1)',
            rotation: -45,
            lineWidth: 4,
            spacing: 7
          }
        ]}
        fill={[
          {
            id: 'lines'
          }
        ]}
        forceSquare={false}
        animate={false}
        hoverTarget="rowColumn"
        cellHoverOthersOpacity={0.5}
      />
    </div>
  );
}

// how to recalculate colors
// import { hexToRGBNormalized, rgbToHex } from 'in-services/formatters/color';
// import getHeatMapColor from 'in-services/heatMapColors';
// const HEAT_MAP_BASE_COLORS = [
//   hexToRGBNormalized('#0000ff'),
//   hexToRGBNormalized('#00ffff'),
//   hexToRGBNormalized('#00ff00'),
//   hexToRGBNormalized('#ffff00'),
//   hexToRGBNormalized('#ff0000')
// ];
// let HEAT_MAP_COLORS = [];
// for (let i = 0; i < 100; i++) {
//   HEAT_MAP_COLORS[i] = getHeatMapColor(null, i / 100, HEAT_MAP_BASE_COLORS);
// }
// HEAT_MAP_COLORS = HEAT_MAP_COLORS.map(rgb => rgbToHex(rgb.r * 255, rgb.g * 255, rgb.b * 255));

function getHeatMapColors() {
  return [
    '#0000ff',
    '#000aff',
    '#0014ff',
    '#001eff',
    '#0028ff',
    '#0033ff',
    '#003dff',
    '#0047ff',
    '#0051ff',
    '#005bff',
    '#0066ff',
    '#0070ff',
    '#007aff',
    '#0084ff',
    '#008eff',
    '#0099ff',
    '#00a3ff',
    '#00adff',
    '#00b7ff',
    '#00c1ff',
    '#00ccff',
    '#00d6ff',
    '#00e0ff',
    '#00eaff',
    '#00f4ff',
    '#00ffff',
    '#00fff4',
    '#00ffea',
    '#00ffe0',
    '#00ffd6',
    '#00ffcc',
    '#00ffc1',
    '#00ffb7',
    '#00ffad',
    '#00ffa3',
    '#00ff99',
    '#00ff8e',
    '#00ff84',
    '#00ff7a',
    '#00ff70',
    '#00ff65',
    '#00ff5b',
    '#00ff51',
    '#00ff47',
    '#00ff3d',
    '#00ff32',
    '#00ff28',
    '#00ff1e',
    '#00ff14',
    '#00ff0a',
    '#00ff00',
    '#0aff00',
    '#14ff00',
    '#1eff00',
    '#28ff00',
    '#33ff00',
    '#3dff00',
    '#47ff00',
    '#51ff00',
    '#5bff00',
    '#65ff00',
    '#70ff00',
    '#7aff00',
    '#84ff00',
    '#8eff00',
    '#99ff00',
    '#a3ff00',
    '#adff00',
    '#b7ff00',
    '#c1ff00',
    '#cbff00',
    '#d6ff00',
    '#e0ff00',
    '#eaff00',
    '#f4ff00',
    '#ffff00',
    '#fff400',
    '#ffea00',
    '#ffe000',
    '#ffd600',
    '#ffcb00',
    '#ffc100',
    '#ffb700',
    '#ffad00',
    '#ffa300',
    '#ff9900',
    '#ff8e00',
    '#ff8400',
    '#ff7a00',
    '#ff7000',
    '#ff6500',
    '#ff5b00',
    '#ff5100',
    '#ff4700',
    '#ff3d00',
    '#ff3300',
    '#ff2800',
    '#ff1e00',
    '#ff1400',
    '#ff0a00'
  ];
}
