/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Switch, Route } from 'react-router';
import React, { Fragment } from 'react';

import ActionCatalog from 'in-automation/ActionCatalog/ActionCatalog';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-automation/automationTabs/ViewSwitcher';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function Automation() {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={actionCatalogPath}>
              <ActionCatalog />
            </Route>
            {/* <Route path={actionHistoryPath}>
              <ActionHistory />
            </Route> */}
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
