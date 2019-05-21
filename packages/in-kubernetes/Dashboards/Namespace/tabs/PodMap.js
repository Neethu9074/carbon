import React from 'react';

import ControlFrame, {
  namespaceGroupings
} from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTreeMap';
import ServerTreeMap from 'in-new-components/TreeMap/ServerTreeMap';
import getTreeMap from 'in-subscription/kubernetes/getTreeMap';

export default function PodMap(props) {
  const { timeConfig, data: namespace } = props;

  return (
    <ControlFrame
      {...props}
      groupingOptions={namespaceGroupings}
      render={_props => (
        <ServerTreeMap
          getTreeMap$={() =>
            getTreeMap({
              grouping: _props.grouping.value,
              filter: {
                namespaceId: namespace.id,
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
