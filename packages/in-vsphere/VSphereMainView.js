import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { clusterListFullyQualified } from 'in-vsphere/navigation/paths';
import ViewSwitcher from 'in-vsphere/lists/components/ViewSwitcher';
import ClusterList from 'in-vsphere/lists/ClusterList';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function VSphereMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Switch>
            <Route path={clusterListFullyQualified} render={() => <ClusterList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
