/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import ControlFrame from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTreeMap';
import MapListToggle from 'in-kubernetes/Dashboards/commonComponents/commonTabs/MapListToggle';
import getKubernetesPods from 'in-kubernetes/subscriptions/getKubernetesPods';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ServerTreeMap from 'in-components/TreeMap/ServerTreeMap';
import { getInfraGranularity } from 'in-stores/metric/metric';
import useUrlState from 'in-hooks/useUrlState';

export default function PodsListWithMap(props) {
  const { PodListRenderer, groupingOptions, getTreeMap } = props;
  const urlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: '/pods',
        name: 'pods.view',
        as: 'view',
        initialState: 'list'
      }
    ]
  };
  const [{ view }, setView] = useUrlState(urlStateConfig);

  if (view === 'list') {
    return <PodListRenderer {...props} leftHeader={<MapListToggle view={view} setView={setView} />} />;
  }

  return (
    <Card>
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
    granularity: getInfraGranularity(timeConfig)
  }).map(result => !result.data || result.data.totalHits > 0);
}
