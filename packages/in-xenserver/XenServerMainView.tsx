/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { xenserverHostListFullyQualified } from 'in-xenserver/navigation/paths';
import XenServerViewSwitcher from 'in-xenserver/lists/components/ViewSwitcher';
// @ts-expect-error
import HostList from 'in-xenserver/lists/HostList';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';

export default function XenServerMainView(props: any) {
  return (
    <>
      <Sticky header={<XenServerViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={xenserverHostListFullyQualified}>
              <HostList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </>
  );
}
