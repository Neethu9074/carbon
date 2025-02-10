/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import {
  clusterListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified
} from 'in-kubernetes/navigation/paths';
import ClusterGrid from 'in-kubernetes/lists/components/ClusterGrid/ClusterGrid';
import { kubernetesCloudNativeExperience } from 'in-services/featureFlags';
import KubernetesExplore from 'in-kubernetes/explore/KubernetesExplore';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import NamespaceList from 'in-kubernetes/lists/NamespaceList';
import ClusterList from 'in-kubernetes/lists/ClusterList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function KubernetesMainView(props) {
  return (
    <>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route
              path={kubernetesCloudNativeExperience ? `${clusterListFullyQualified}/table` : clusterListFullyQualified}
              exact
            >
              <ClusterList {...props} />
            </Route>
            {kubernetesCloudNativeExperience && (
              <Route path={clusterListFullyQualified || `${clusterListFullyQualified}/grid`}>
                <ClusterGrid {...props} />
              </Route>
            )}
            <Route path={namespaceListFullyQualified}>
              <NamespaceList {...props} />
            </Route>
            <Route path={exploreFullyQualified}>
              <KubernetesExplore {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </>
  );
}
