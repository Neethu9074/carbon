import React, { Fragment } from 'react';

import getNamespaceTreeMap from 'in-subscription/kubernetes/getNamespaceTreeMap';
import ControlFrame from 'in-kubernetes/Dashboards/Namespace/tabs/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/Namespace/tabs/PodTreeMap';
import ServerTreeMap from 'in-new-components/TreeMap/ServerTreeMap';
import WithIcon from 'in-new-components/WithIcon';

import locals from './PodMapTab.mless';

export default function PodMapTab(props) {
  const { timeConfig, data: namespaceItem } = props;

  return (
    <Fragment>
      <div className={locals.header}>
        <WithIcon icon="lib_kubernetes_pod">
          <span className={locals.headerLabel}>Pod Map</span>
        </WithIcon>
      </div>

      <ControlFrame
        {...props}
        render={_props => {
          return (
            <ServerTreeMap
              getTreeMap$={() =>
                getNamespaceTreeMap({
                  namespaceId: namespaceItem.namespace.id,
                  grouping: _props.grouping,
                  timeConfig
                })
              }
              treeMapRendererProps={{ ...props, ..._props }}
              TreeMapRenderer={PodTreeMap}
            />
          );
        }}
      />
    </Fragment>
  );
}
