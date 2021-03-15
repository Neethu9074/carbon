/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { clusterGroupings } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodsListWithMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodsListWithMap';
import { PodsWithNamespaces } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import getTreeMap from 'in-subscription/kubernetes/getTreeMap';

export default function Pods(props) {
  const { timeConfig, data: cluster } = props;

  return (
    <PodsListWithMap
      {...props}
      initialGrouping="namespace"
      PodListRenderer={PodsWithNamespaces}
      groupingOptions={clusterGroupings}
      getTreeMap={grouping =>
        getTreeMap({
          grouping,
          filter: {
            clusterId: cluster.id,
            timeConfig
          }
        })
      }
    />
  );
}
