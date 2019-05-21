import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { find } from 'lodash';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import HighlightSwitch from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/HighlightSwitch';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import ComboBox from 'in-components/ComboBox';

import locals from './ControlFrame.mless';

const sizeByConfigs = [
  {
    value: 'cpu',
    format: twoDecimalPlaces,
    metricType: 'Limits',
    label: 'CPU'
  },
  {
    value: 'memory',
    format: bytesZeroDecimalPlaces,
    metricType: 'Limits',
    label: 'Memory'
  },
  {
    value: 'containers',
    format: zeroDecimalPlaces,
    metricType: 'Limits',
    label: 'Containers'
  }
];

export const namespaceGroupings = [
  {
    value: 'DEPLOYMENT',
    label: 'Deployment',
    getEntity: getKubernetesDeployment
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

const metricTypes = ['Limits', 'Requests'];

export default compose(
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => '/podMap',
    getMatrixPrefix: () => 'treemap.',
    boundKeys: ['showHealth', 'grouping', 'metricType', 'sizeMetricConfig'],
    getInitialState: () => ({
      showHealth: false,
      grouping: namespaceGroupings[1],
      metricType: metricTypes[0],
      sizeMetricConfig: sizeByConfigs[1]
    }),
    reducerName: 'setConfig',
    getSerializedUrlValues: props => {
      return {
        showHealth: props.showHealth,
        grouping: props.grouping.value,
        metricType: props.metricType,
        sizeMetricConfig: props.sizeMetricConfig.value
      };
    },
    getParsedUrlValues: values => {
      return {
        showHealth: values.showHealth === 'true',
        grouping: find(clusterGroupings, g => g.value === values.grouping),
        metricType: values.metricType,
        sizeMetricConfig: find(sizeByConfigs, c => c.value === values.sizeMetricConfig)
      };
    }
  })
)(ControlFrame);

function ControlFrame(props) {
  const { grouping, sizeMetricConfig, metricType, showHealth, setConfig, groupingOptions, render } = props;
  return (
    <MaxWidthFullscreenContainer>
      <div className={locals.frame}>
        <div className={locals.left}>
          <span className={locals.label}>Group by</span>
          <ComboBox
            className={locals.input}
            id="size-by"
            value={grouping}
            options={groupingOptions}
            onChange={_grouping => setConfig({ grouping: _grouping })}
            clearable={false}
            openOnFocus
          />
          <span className={locals.label}>Size by</span>
          <ComboBox
            className={locals.input}
            id="size-by"
            value={sizeMetricConfig}
            options={sizeByConfigs}
            onChange={_config => setConfig({ sizeMetricConfig: _config })}
            clearable={false}
            openOnFocus
          />
          {sizeMetricConfig.value !== 'containers' && (
            <Fragment>
              <span className={locals.label}>Metric</span>
              <ComboBox
                className={locals.input}
                id="size-by"
                value={{ label: metricType }}
                options={metricTypes.map(label => ({ label }))}
                onChange={_type => setConfig({ metricType: _type.label })}
                clearable={false}
                openOnFocus
              />
            </Fragment>
          )}
        </div>
        <HighlightSwitch showHealth={showHealth} setShowHealth={_b => setConfig({ showHealth: _b })} />
      </div>
      {render(props)}
    </MaxWidthFullscreenContainer>
  );
}
