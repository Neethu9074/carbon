import { compose, withPropsOnChange } from 'recompose';
import { combineLatest } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import getKubernetesEntitiesHealthInfo from 'in-subscription/kubernetes/getKubernetesEntitiesHealthInfo';
import PodTooltip, { PodTooltipComponent } from 'in-kubernetes/Dashboards/Namespace/tabs/PodTooltip';
import { podDashboard, podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { createColorPool } from 'in-services/util/ColorGenerator';
import Delayed from 'in-new-components/Delayed/Delayed';
import { lighten } from 'in-services/formatters/color';
import { mutateUrl } from 'in-stores/navigation';
import TreeMap from 'in-new-components/TreeMap';
import connect from 'in-hoc/connectTo';
import theme from 'in-themes';

const predefinedColorPalette = theme.lib.colors.chart.strokeColors100.map(hex => lighten(hex, 0.5));

export default compose(
  withPropsOnChange(['data'], ({ data }) => {
    if (!data.ids[0]) {
      return {};
    }
    return {
      colorPool: createColorPool('podTreeMapColors', predefinedColorPalette.length, predefinedColorPalette)
    };
  }),
  connect(props => {
    const { showHealth, timeConfig, data, sizeMetricConfig } = props;
    const observables = {};
    const podIds = data.ids[1]; // level 0 = groups, level 1 = pods, level 2 = container

    if (showHealth && podIds.length > 0) {
      observables.entitiesHealthInfo = getKubernetesEntitiesHealthInfo({
        timeConfig,
        ids: podIds
      }).map(result => result.data);
    }

    if (sizeMetricConfig) {
      observables.podMetricValues = combineLatest(
        podIds.map(id =>
          getTimeWindowBasedMetricAggregation({
            snapshotId: id,
            metric: `${sizeMetricConfig.metricName}${sizeMetricConfig.metricType}`,
            timeWindowAggregation: 'mean',
            timeConfig
          }).map(data => ({ id, value: data }))
        )
      )
        .debounce(250)
        .map(metrics => {
          const metricsAsMap = {};
          let minValue = Number.MAX_VALUE;
          let maxValue = 0;
          for (let i = 0; i < metrics.length; i++) {
            const { id, value } = metrics[i];
            metricsAsMap[id] = { value, format: sizeMetricConfig.format };
            minValue = Math.min(minValue, value);
            maxValue = Math.max(maxValue, value);
          }
          metricsAsMap.minValue = minValue;
          metricsAsMap.maxValue = maxValue;
          return metricsAsMap;
        });
    }

    return observables;
  })
)(PodTreeMap);

function PodTreeMap(props) {
  const { data, podMetricValues, timeConfig, showHealth, grouping, colorPool, entitiesHealthInfo = {} } = props;

  return (
    <TreeMap
      data={data}
      mapData={_data => mapTreeMapData(_data, podMetricValues, entitiesHealthInfo)}
      customHeight={600}
      nivoProperties={{
        orientLabel: false,
        leavesOnly: true,
        label: pod => pod.label,
        colorBy: n => getColorForTreeNode(n, showHealth, colorPool),
        tooltip: props => (
          <Delayed waitingComponent={PodTooltipComponent} grouping={grouping}>
            <PodTooltip {...props} timeConfig={timeConfig} grouping={grouping} />
          </Delayed>
        ),
        onClick: n =>
          mutateUrl(location => {
            location.pathname = `${podDashboardFullyQualified}/summary`;
            setOrDeleteMatrixKey(location, podDashboard, matrixPodId, n.data.id);
            return location;
          })
      }}
    />
  );
}

function mapTreeMapData(_data, metricValues, entitiesHealthInfo) {
  entitiesHealthInfo = entitiesHealthInfo || {};

  // add 5% of the values full domain to all values after calculating the label. This is just for visual feedback
  // since all boxes which have a value = 0 would completely disappear.
  let valueAdding = 0;
  if (metricValues) {
    if (metricValues.maxValue === metricValues.minValue) {
      valueAdding = 1;
    } else {
      valueAdding = (metricValues.maxValue - metricValues.minValue) * 0.05;
    }
  }

  return {
    id: _data.treeMapData.root.id,
    isRoot: true,
    children: _data.treeMapData.root.children.map(group => ({
      id: group.id,
      isGroup: true,
      children: group.children.map(pod => {
        let value;
        let label;
        if (metricValues && metricValues[pod.id]) {
          const metricValue = metricValues[pod.id];
          value = Math.max(0, metricValue.value);
          label = metricValue.format(value);
          value += valueAdding;
        } else {
          value = get(pod, ['children', 'length'], 1);
          label = `${value} Container${value > 1 ? 's' : ''}`;
        }
        return {
          groupId: group.id,
          isPod: true,
          id: pod.id,
          value,
          label,
          health: entitiesHealthInfo[pod.id]
        };
      })
    }))
  };
}

function getColorForTreeNode(n, showHealth, colorPool) {
  if (!n.isPod) {
    return '#ff0000';
  }
  if (n.health) {
    if (n.health.maxSeverity > 5) {
      return theme.lib.colors.failure;
    }
    if (n.health.maxSeverity > 0) {
      return theme.lib.colors.warning;
    }
  }
  if (showHealth) {
    return lighten(theme.lib.colors.lightBlue800, 0.1);
  }
  return lighten(colorPool.getColorHex(n.groupId), 0.5);
}
