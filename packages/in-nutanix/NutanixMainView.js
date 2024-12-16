/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { nutanixClusterListFullyQualified } from 'in-nutanix/navigation/paths';
// @ts-expect-error
import NutanixList from 'in-nutanix/lists/NutanixList';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-nutanix/lists/components/ViewSwitcher';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function NutanixMainView(props) {
  return (
    <>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={nutanixClusterListFullyQualified}>
              <NutanixList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </>
  );
}
