/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { phmcListFullyQualified, systemListFullyQualified } from 'in-phmc/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-phmc/lists/components/ViewSwitcher';
import SystemList from 'in-phmc/lists/SystemList';
import PhmcList from 'in-phmc/lists/PhmcList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function PhmcMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={phmcListFullyQualified}>
              <PhmcList {...props} />
            </Route>
            <Route path={systemListFullyQualified}>
              <SystemList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
