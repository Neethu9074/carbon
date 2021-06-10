/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { clusterListFullyQualified, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import ViewSwitcher from 'in-kubernetes/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
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
            <Route path={clusterListFullyQualified} render={() => <ClusterList {...props} />} />
            <Route path={namespaceListFullyQualified} render={() => <NamespaceList {...props} />} />
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
