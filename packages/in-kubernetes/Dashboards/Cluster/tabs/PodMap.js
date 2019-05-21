import React from 'react';

import ControlFrame, {
  clusterGroupings
} from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTreeMap';
import ServerTreeMap from 'in-new-components/TreeMap/ServerTreeMap';
import getTreeMap from 'in-subscription/kubernetes/getTreeMap';

export default function PodMap(props) {
  const { timeConfig, data: cluster } = props;

  return (
    <ControlFrame
      {...props}
      groupingOptions={clusterGroupings}
      render={_props => (
        <ServerTreeMap
          getTreeMap$={() =>
            getTreeMap({
              grouping: _props.grouping.value,
              filter: {
                clusterId: cluster.id,
                timeConfig
              }
            })
          }
          treeMapRendererProps={{
            ...props,
            ..._props
          }}
          TreeMapRenderer={PodTreeMap}
        />
      )}
    />
  );
}
