import { defaultProps, compose, renameProps } from 'recompose';
import { HeatMap } from '@nivo/heatmap';
import React from 'react';

import getElementDimensions from 'in-hoc/getElementDimensions';

import locals from './HeatMap.mless';

export default compose(
  renameProps({
    height: 'customHeight',
    width: 'customWidth'
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
    <div style={{ width: customWidth || width }} className={locals.heatMap}>
      <HeatMap
        height={customHeight || height}
        width={customWidth || width}
        data={data}
        keys={keys}
        indexBy="calls"
        colors="YlOrRd"
        margin={{
          top: 0,
          right: 0,
          bottom: 60,
          left: 60
        }}
        forceSquare
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
        animate={false}
        motionStiffness={300}
        motionDamping={40}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.5}
      />
    </div>
  );
}
