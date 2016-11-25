import React from 'react';

import createTooltip from 'in-map/components/tooltips/Tooltip';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import {emptyArray} from 'in-services/fixedObjects';
import MetricValue from 'in-components/MetricValue';
import {getFormattedValue} from 'in-sdk/metrics';
import {getSnapshot} from 'in-stores/snapshot';
import {activeMetric$} from 'in-stores/metric';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import 'in-map/components/tooltips/physical/NodeMetric/NodeMetric.less';


const block = 'in-tooltip-node-metric';

export default createTooltip(connectTo(props => {
  return {
    snapshot: getSnapshot(props.entity.parentNode.id),
    activeMetric: activeMetric$
  };
},
  function NodeMetric({snapshot, activeMetric}) {
    if (!activeMetric || !snapshot) {
      return null;
    }

    const metrics = activeMetric.get('metrics', emptyArray).slice().reverse();
    const colors = theme.chart.strokeColors.slice(0, metrics.size).reverse();
    let colorIndex = 0;

    return (
      <ul className={block}>
        {metrics.map(metric => {
          const name = metric.get('name');
          // rotate colors max colors are used
          const color = colors[colorIndex++];
          colorIndex = (colorIndex + 1) % colors.length;

          return (
            <li key={name}
                className={block + '__item'}>
              <Heading className={block + '__name'}
                     style={{color}}>
                {metric.get('label')}
              </Heading>

              <Content className={block + '__value'}>
              <MetricValue snapshotId={snapshot.get('id')}
                           metric={name}
                           formatter={v => getFormattedValue(name, snapshot, v)}/>
              </Content>
            </li>
          );
        })}
      </ul>
    );
  }
));
