/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { phmcListFullyQualified, systemListFullyQualified } from 'in-phmc/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-phmc/lists/components/ViewSwitcher';
import PhmcList from 'in-phmc/lists/PhmcList';
import SystemList from 'in-phmc/lists/SystemList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function PhmcMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={phmcListFullyQualified} render={() => <PhmcList {...props} />} />
            <Route path={systemListFullyQualified} render={() => <SystemList {...props} />} />
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
