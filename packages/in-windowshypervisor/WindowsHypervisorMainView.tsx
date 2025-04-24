/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { windowsHypervisorHostListFullyQualified } from 'in-windowshypervisor/navigation/paths';
import WindowsHypervisorViewSwitcher from 'in-windowshypervisor/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
// @ts-expect-error
import HostList from 'in-windowshypervisor/lists/HostList';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';

export default function WindowsHypervisorMainView(props: any) {
  return (
    <>
      <Sticky header={<WindowsHypervisorViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={windowsHypervisorHostListFullyQualified}>
              <HostList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </>
  );
}
