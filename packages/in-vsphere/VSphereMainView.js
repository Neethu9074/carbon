import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import ViewSwitcher from 'in-vsphere/lists/components/ViewSwitcher';
import DatacenterList from 'in-vsphere/lists/DatacenterList';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function VSphereMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Switch>
            <Route path={datacenterListFullyQualified} render={() => <DatacenterList {...props} />} />
          </Switch>
        </MaxWidthFullscreenContainer>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
