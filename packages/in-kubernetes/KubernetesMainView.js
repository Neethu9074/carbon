/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import {
  clusterListFullyQualified,
  clusterOtelListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified
} from 'in-kubernetes/navigation/paths';
import { kubernetesCloudNativeExperience, openTelemetryKubernetesUnifiedViewEnabled } from 'in-services/featureFlags';
import OtelClusterCardView from 'in-kubernetes/lists/OtelCluster/OtelClusterCardView';
import OtelClusterTable from 'in-kubernetes/lists/ClusterTable/OtelClusterTable';
import NamespaceTable from 'in-kubernetes/lists/NamespaceTable/NamespaceTable';
import ClusterTable from 'in-kubernetes/lists/ClusterTable/ClusterTable';
import KubernetesExplore from 'in-kubernetes/explore/KubernetesExplore';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import NamespaceCardView from 'in-kubernetes/lists/NamespaceCardView';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ClusterCardView from 'in-kubernetes/lists/ClusterCardView';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function KubernetesMainView(props) {
  return (
    <>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route
              path={
                openTelemetryKubernetesUnifiedViewEnabled
                  ? `${clusterOtelListFullyQualified}/table`
                  : `${clusterOtelListFullyQualified}`
              }
              exact
            >
              <OtelClusterTable {...props} />
            </Route>
            <Route
              path={kubernetesCloudNativeExperience ? `${clusterListFullyQualified}/table` : clusterListFullyQualified}
              exact
            >
              <ClusterTable {...props} />
            </Route>
            <Route
              path={
                kubernetesCloudNativeExperience ? `${namespaceListFullyQualified}/table` : namespaceListFullyQualified
              }
              exact
            >
              <NamespaceTable {...props} />
            </Route>
            {kubernetesCloudNativeExperience && (
              <>
                {openTelemetryKubernetesUnifiedViewEnabled && (
                  <Route exact path={`${clusterOtelListFullyQualified}`}>
                    <OtelClusterCardView {...props} />
                  </Route>
                )}
                <>
                  <Route exact path={clusterListFullyQualified || `${clusterListFullyQualified}`}>
                    <ClusterCardView {...props} />
                  </Route>
                  <Route path={namespaceListFullyQualified || `${namespaceListFullyQualified}`}>
                    <NamespaceCardView {...props} />
                  </Route>
                </>
              </>
            )}
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
