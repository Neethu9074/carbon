/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { powervcRegionListFullyQualified } from 'in-powervc/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-powervc/lists/components/ViewSwitcher';
import RegionList from 'in-powervc/lists/RegionList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function PowervcMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={powervcRegionListFullyQualified}>
              <RegionList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
