/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ControlFrame from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTreeMap';
import MapListToggle from 'in-kubernetes/Dashboards/commonComponents/commonTabs/MapListToggle';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import getKubernetesPods from 'in-kubernetes/subscriptions/getKubernetesPods';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ServerTreeMap from 'in-components/TreeMap/ServerTreeMap';
import { getInfraGranularity } from 'in-stores/metric/metric';
import useUrlState from 'in-hooks/useUrlState';

export default PodsListWithMap;

const urlStateDefinition = [
  {
    name: 'pods.view',
    path: '/pods',
    initialState: 'list',
    parser: buildJsonParser(),
    serializer: buildJsonSerializer(),
    as: 'view'
  }
];

function PodsListWithMap(props) {
  const { PodListRenderer, groupingOptions, getTreeMap } = props;

  const [urlState, setView] = useUrlState({ bind: urlStateDefinition, replaceHistory: false });

  const { view } = urlState;

  if (view === 'list') {
    return <PodListRenderer {...props} leftHeader={<MapListToggle view={view} setView={setView} />} />;
  }

  return (
    <ControlFrame
      {...props}
      view={view}
      setView={setView}
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
    granularity: getInfraGranularity(timeConfig)
  }).map(result => !result.data || result.data.totalHits > 0);
}
