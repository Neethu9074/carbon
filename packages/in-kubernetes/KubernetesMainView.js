import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { clusterListFullyQualified, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import NamespaceList from 'in-kubernetes/lists/NamespaceList';
import ClusterList from 'in-kubernetes/lists/ClusterList';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function KubernetesMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Switch>
            <Route path={clusterListFullyQualified} render={() => <ClusterList {...props} />} />
            <Route path={namespaceListFullyQualified} render={() => <NamespaceList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
