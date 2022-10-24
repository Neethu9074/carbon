/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  clusterListFullyQualified,
  namespaceListFullyQualified,
  exploreFullyQualified,
  k8sTeamFullyQualified
} from 'in-kubernetes/navigation/paths';
import KubernetesExplore from 'in-kubernetes/explore/KubernetesExplore';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import KubernetesTeam from 'in-kubernetes/team/KubernetesTeam';
import NamespaceList from 'in-kubernetes/lists/NamespaceList';
import ClusterList from 'in-kubernetes/lists/ClusterList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function KubernetesMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={clusterListFullyQualified}>
              <ClusterList {...props} />
            </Route>
            <Route path={namespaceListFullyQualified}>
              <NamespaceList {...props} />
            </Route>
            <Route path={exploreFullyQualified}>
              <KubernetesExplore {...props} />
            </Route>
            <Route path={k8sTeamFullyQualified}>
              <KubernetesTeam {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
