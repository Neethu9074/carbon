/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { regionListFullyQualified } from 'in-openstack/navigation/paths';
import ViewSwitcher from 'in-openstack/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import RegionList from 'in-openstack/lists/RegionList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function OpenstackMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={regionListFullyQualified}>
              <RegionList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
