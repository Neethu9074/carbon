/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { regionListFullyQualified, hypervisorListFullyQualified } from 'in-openstack/navigation/paths';
import ViewSwitcher from 'in-openstack/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import HypervisorList from 'in-openstack/lists/RegionList';
import RegionList from 'in-openstack/lists/RegionList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function OpenstackMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={regionListFullyQualified} render={() => <RegionList {...props} />} />
            <Route path={hypervisorListFullyQualified} render={() => <HypervisorList {...props} />} />
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
