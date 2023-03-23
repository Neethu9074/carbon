/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  sapSystemListFullyQualified,
  sapInstanceListFullyQualified,
  sapDbInstanceListFullyQualified
} from 'in-sap/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-sap/lists/components/ViewSwitcher';
import SapDbInstanceList from 'in-sap/lists/SapDbInstanceList';
import AbapInstanceList from 'in-sap/lists/AbapInstanceList';
import AbapSystemsList from 'in-sap/lists/AbapSystemsList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function SapMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={sapSystemListFullyQualified}>
              <AbapSystemsList {...props} />
            </Route>
            <Route path={sapInstanceListFullyQualified}>
              <AbapInstanceList {...props} />
            </Route>
            <Route path={sapDbInstanceListFullyQualified}>
              <SapDbInstanceList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
