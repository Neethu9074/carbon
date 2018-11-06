import { Switch, Route } from 'react-router-dom';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { clusterList, namespaceList } from 'in-kubernetes/navigation/paths';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import NamespaceList from 'in-kubernetes/lists/NamespaceList';
import ClusterList from 'in-kubernetes/lists/ClusterList';
import Sticky from 'in-components/Sticky';

export default function KubernetesMainView(props) {
  return (
    <div>
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Switch>
            <Route path={clusterList} render={() => <ClusterList {...props} />} />
            <Route path={namespaceList} render={() => <NamespaceList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
    </div>
  );
}
