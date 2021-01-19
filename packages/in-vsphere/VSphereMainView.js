/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { datacenterListFullyQualified } from 'in-vsphere/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-vsphere/lists/components/ViewSwitcher';
import DatacenterList from 'in-vsphere/lists/DatacenterList';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function VSphereMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={datacenterListFullyQualified} render={() => <DatacenterList {...props} />} />
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
