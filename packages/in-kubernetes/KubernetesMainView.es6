import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { clusterListFullyQualified, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BetaMarker, { KubernetesBetaMarker } from 'in-new-components/BetaMarker';
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
            <Route path={clusterListFullyQualified} render={() => <ClusterList {...props} />} />
            <Route path={namespaceListFullyQualified} render={() => <NamespaceList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
      <BetaMarker title="Tech Preview">{KubernetesBetaMarker}</BetaMarker>
    </div>
  );
}
