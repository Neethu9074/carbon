import { defaultProps, compose, renameProps } from 'recompose';
import { TreeMap as NivoTreeMap } from '@nivo/treemap';
import React from 'react';

import NivoChartTooltip from 'in-components/Chart/components/NivoChartTooltip';
import getElementDimensions from 'in-hoc/getElementDimensions';
import theme from 'in-themes';

import locals from './TreeMap.mless';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  getElementDimensions,
  defaultProps({
    customHeight: 300
  })
)(TreeMap);

const colors = ['#ffffff', theme.lib.colors.N300, '#b3def3'];

function TreeMap({ width, height, customWidth, customHeight, data, mapData, nivoProperties }) {
  if (!width || !data) {
    return <div style={{ height: customHeight || height }} className={locals.treeMap} />;
  }

  width = customWidth || width;
  height = customHeight || height;

  return (
    <div className={locals.treeMap}>
      <NivoTreeMap
        height={height}
        width={width}
        root={mapData ? mapData(data) : data}
        identity="id"
        value="value"
        innerPadding={4}
        outerPadding={8}
        labelTextColor="inherit:darker(1.7)"
        binary="binary"
        margin={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
        colorBy={n => colors[n.depth]}
        animate
        motionStiffness={280}
        motionDamping={25}
        tooltip={props => <NivoChartTooltip {...props} id="Value" formatter={{ detailed: v => v }} />}
        {...nivoProperties}
      />
    </div>
  );
}
