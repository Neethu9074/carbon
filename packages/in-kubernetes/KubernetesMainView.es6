import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { kubernetes, clusterList, serviceList, namespaceList } from 'in-kubernetes/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import NamespaceList from 'in-kubernetes/lists/NamespaceList';
import ServiceList from 'in-kubernetes/lists/ServiceList';
import ClusterList from 'in-kubernetes/lists/ClusterList';
import Sticky from 'in-components/Sticky';

export default function KubernetesMainView(props) {
  return (
    <div>
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Switch>
            <Route path={clusterList} render={() => <ClusterList {...props} />} />
            <Route path={serviceList} render={() => <ServiceList {...props} />} />
            <Route path={namespaceList} render={() => <NamespaceList {...props} />} />

            {/* landing page of kubernetes */}
            <Route path={kubernetes} render={() => <ServiceList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
    </div>
  );
}
