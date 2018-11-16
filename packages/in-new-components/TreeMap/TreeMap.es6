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

function TreeMap({ width, height, customWidth, customHeight, data }) {
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
        root={data}
        identity="id"
        value="value"
        innerPadding={16}
        outerPadding={16}
        labelTextColor="#000"
        margin={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
        colorBy={n => theme.chart.strokeColors[n.depth]}
        animate
        motionStiffness={90}
        motionDamping={11}
        tooltip={props => <NivoChartTooltip {...props} id="Value" formatter={{ detailed: v => v }} />}
      />
    </div>
  );
}
