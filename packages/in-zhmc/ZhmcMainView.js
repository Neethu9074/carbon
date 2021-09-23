/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { zhmcListFullyQualified, cpcListFullyQualified } from 'in-zhmc/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-zhmc/lists/components/ViewSwitcher';
import ZhmcList from 'in-zhmc/lists/ZhmcList';
import CpcList from 'in-zhmc/lists/CpcList';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function ZhmcMainView(props) {
  return (
    <Fragment>
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={zhmcListFullyQualified} render={() => <ZhmcList {...props} />} />
            <Route path={cpcListFullyQualified} render={() => <CpcList {...props} />} />
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </Fragment>
  );
}
