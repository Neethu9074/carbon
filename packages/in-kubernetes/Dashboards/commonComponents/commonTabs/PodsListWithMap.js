/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose } from 'recompose';
import React from 'react';

import ControlFrame from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTreeMap';
import MapListToggle from 'in-kubernetes/Dashboards/commonComponents/commonTabs/MapListToggle';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import ServerTreeMap from 'in-new-components/TreeMap/ServerTreeMap';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import Card from 'in-new-components/Card';

export default compose(
  withUrlDependingState({
    replaceHistory: false,
    getPathSegment: () => '/pods',
    getMatrixPrefix: () => 'pods.',
    boundKeys: ['view'],
    reducerName: 'setView',
    getInitialState: () => ({
      view: 'list'
    }),
    getSerializedUrlValues: props => ({
      view: props.view
    }),
    getParsedUrlValues: values => ({
      view: values.view
    })
  })
)(PodsListWithMap);

function PodsListWithMap(props) {
  const { view, setView, PodListRenderer, groupingOptions, getTreeMap } = props;

  if (view === 'list') {
    return <PodListRenderer {...props} leftHeader={<MapListToggle view={view} setView={setView} />} />;
  }

  return (
    <Card>
      <ControlFrame
        {...props}
        groupingOptions={groupingOptions}
        render={_props => (
          <WithEmptyStateFallback getHasDataToRender={() => getHasDataToRender(props)}>
            <ServerTreeMap
              getTreeMap$={() => getTreeMap(_props.grouping.value)}
              treeMapRendererProps={{
                ...props,
                ..._props
              }}
              TreeMapRenderer={PodTreeMap}
            />
          </WithEmptyStateFallback>
        )}
      />
    </Card>
  );
}

function getHasDataToRender({
  namespaceId,
  deploymentId,
  deploymentConfigId,
  clusterId,
  serviceId,
  nodeId,
  timeConfig
}) {
  return getKubernetesPods({
    pagination: {
      page: 1,
      pageSize: 20
    },
    order: {
      by: 'name',
      direction: 'ASC'
    },
    filter: {
      label: '',
      namespaceId,
      deploymentId,
      deploymentConfigId,
      clusterId,
      serviceId,
      nodeId,
      timeConfig,
      phase: null
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  }).map(result => !result.data || result.data.totalHits > 0);
}
