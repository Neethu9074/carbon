/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { namespaceGroupings } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodsListWithMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodsListWithMap';
import PodsList from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import getTreeMap from 'in-subscription/kubernetes/getTreeMap';

export default function Pods(props) {
  const { timeConfig, data: namespace } = props;

  return (
    <PodsListWithMap
      {...props}
      PodListRenderer={PodsList}
      groupingOptions={namespaceGroupings}
      getTreeMap={grouping =>
        getTreeMap({
          grouping,
          filter: {
            namespaceId: namespace.id,
            timeConfig
          }
        })
      }
    />
  );
}
