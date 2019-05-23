import { compose } from 'recompose';
import React from 'react';

import ControlFrame from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/ControlFrame';
import PodTreeMap from 'in-kubernetes/Dashboards/commonComponents/commonTabs/PodMap/PodTreeMap';
import MapListToggle from 'in-kubernetes/Dashboards/commonComponents/commonTabs/MapListToggle';
import ServerTreeMap from 'in-new-components/TreeMap/ServerTreeMap';
import withUrlDependingState from 'in-hoc/withUrlDependingState';

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
    <ControlFrame
      {...props}
      groupingOptions={groupingOptions}
      render={_props => (
        <ServerTreeMap
          getTreeMap$={() => getTreeMap(_props.grouping.value)}
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
