/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error TS migration
import PodsListWithMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodsListWithMap';
// @ts-expect-error TS migration
import { PodsWithNamespaces } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import { clusterGroupings } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/constants';
// @ts-expect-error TS migration
import getTreeMap from 'in-kubernetes/subscriptions/getTreeMap';

export default function OtelPods(props: any) {
  const { timeConfig, data: cluster } = props;

  interface Cluster {
    id: string;
    [key: string]: any;
  }

  interface OtelPodsProps {
    timeConfig: any;
    data: Cluster;
    [key: string]: any;
  }

  return (
    <PodsListWithMap
      {...(props as OtelPodsProps)}
      initialGrouping="namespace"
      PodListRenderer={PodsWithNamespaces}
      groupingOptions={clusterGroupings}
      getTreeMap={(grouping: string) =>
        getTreeMap({
          grouping,
          filter: {
            clusterId: (cluster as Cluster).id,
            timeConfig
          }
        })
      }
    />
  );
}
