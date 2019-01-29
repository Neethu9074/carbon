import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { clusterListFullyQualified, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import NamespaceList from 'in-kubernetes/lists/NamespaceList';
import ClusterList from 'in-kubernetes/lists/ClusterList';
import BetaMarker from 'in-new-components/BetaMarker';
import Button from 'in-new-components/Button';
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
      <BetaMarker title="Tech Preview">
        <p>
          You are looking at the new Kubernetes support from Instana, which is currently in a Tech Preview. Please get
          in touch with us for any questions and feedback
        </p>
        <Button kind="primaryv2" href="mailto:matthias.luebken@instana.com?subject=Feedback on Kubernetes support">
          Provide Feedback
        </Button>
      </BetaMarker>
    </div>
  );
}
