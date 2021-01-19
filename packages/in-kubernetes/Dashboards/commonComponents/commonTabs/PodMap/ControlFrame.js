/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import HighlightSwitch from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/HighlightSwitch';
import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import MapListToggle from 'in-kubernetes/Dashboards/commonComponents/commonTabs/MapListToggle';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { compareIgnoreCase } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';

import locals from './ControlFrame.mless';

const sizeByConfigs = [
  {
    value: 'cpuLimits',
    format: twoDecimalPlaces,
    label: 'CPU Limits'
  },
  {
    value: 'cpuRequests',
    format: twoDecimalPlaces,
    label: 'CPU Requests'
  },
  {
    value: 'memoryLimits',
    format: bytesZeroDecimalPlaces,
    label: 'Memory Limits'
  },
  {
    value: 'memoryRequests',
    format: bytesZeroDecimalPlaces,
    label: 'Memory Requests'
  },
  {
    value: 'containers',
    format: zeroDecimalPlaces,
    label: 'Containers'
  }
];

export const namespaceGroupings = [
  {
    value: 'DEPLOYMENT',
    label: 'Deployment',
    getEntity: getKubernetesWorkloadController
  },
  {
    value: 'SERVICE',
    label: 'Service',
    getEntity: getKubernetesService
  },
  {
    value: 'NODE',
    label: 'Node',
    getEntity: getKubernetesNode
  }
];

export const clusterGroupings = [
  ...namespaceGroupings,
  {
    value: 'NAMESPACE',
    label: 'Namespace',
    getEntity: getKubernetesNamespace
  }
];

export default compose(
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => '/pods',
    getMatrixPrefix: () => 'podMap.',
    boundKeys: ['showHealth', 'grouping', 'metricType', 'sizeMetricConfig'],
    reducerName: 'setConfig',
    getInitialState,
    getSerializedUrlValues,
    getParsedUrlValues
  })
)(ControlFrame);

function ControlFrame(props) {
  const { grouping, showHealth, sizeMetricConfig, setConfig, groupingOptions, view, setView, render } = props;
  return (
    <div>
      <div className={locals.header}>
        <MapListToggle view={view} setView={setView} />
        <div className={locals.right}>
          <span className={locals.label}>Group by</span>
          <ComboBox
            className={locals.input}
            id="size-by"
            value={grouping}
            options={groupingOptions}
            onChange={_grouping => setConfig({ grouping: _grouping })}
            clearable={false}
            openOnFocus
            searchable={false}
          />
          <HighlightSwitch showHealth={showHealth} setShowHealth={_b => setConfig({ showHealth: _b })} />
        </div>
      </div>

      <StickySidebarContainer
        sidebar={
          <SideNavigation>
            {sizeByConfigs.map(config => (
              <SideNavigationItem
                key={config.value}
                label={config.label}
                isActive={sizeMetricConfig.value === config.value}
                omitEmptyIcon
                onClick={() => setConfig({ sizeMetricConfig: config })}
              />
            ))}
          </SideNavigation>
        }
      >
        {render(props)}
      </StickySidebarContainer>
    </div>
  );
}

function getInitialState(props) {
  const initialGrouping = props.initialGrouping && getGroupingByValue(props.initialGrouping);
  return {
    showHealth: false,
    grouping: initialGrouping || namespaceGroupings[1],
    sizeMetricConfig: sizeByConfigs[sizeByConfigs.length - 1]
  };
}

function getSerializedUrlValues(props) {
  return {
    showHealth: props.showHealth,
    grouping: props.grouping.value,
    sizeMetricConfig: props.sizeMetricConfig.value
  };
}

function getParsedUrlValues(values) {
  return {
    showHealth: values.showHealth === 'true',
    grouping: find(clusterGroupings, g => g.value === values.grouping),
    sizeMetricConfig: find(sizeByConfigs, c => c.value === values.sizeMetricConfig)
  };
}

function getGroupingByValue(value) {
  for (let i = 0; i < clusterGroupings.length; i++) {
    if (compareIgnoreCase(clusterGroupings[i].value, value) === 0) {
      return clusterGroupings[i];
    }
  }
}
