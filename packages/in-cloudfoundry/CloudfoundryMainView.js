/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { applicationListFullyQualified } from 'in-cloudfoundry/navigation/paths';
import ViewSwitcher from 'in-cloudfoundry/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ApplicationList from 'in-cloudfoundry/lists/ApplicationList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function CloudfoundryMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={applicationListFullyQualified} render={() => <ApplicationList {...props} />} />
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
