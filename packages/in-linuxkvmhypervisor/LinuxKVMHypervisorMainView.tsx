/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { linuxkvmhypervisorHostListFullyQualified } from 'in-linuxkvmhypervisor/navigation/paths';
import LinuxKVMHypervisorViewSwitcher from 'in-linuxkvmhypervisor/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
// @ts-expect-error
import HostList from 'in-linuxkvmhypervisor/lists/HostList';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';

export default function LinuxKVMHypervisorMainView(props: any) {
  return (
    <>
      <Sticky header={<LinuxKVMHypervisorViewSwitcher />}>
        <LeftRightPadding>
          <Switch>
            <Route path={linuxkvmhypervisorHostListFullyQualified}>
              <HostList {...props} />
            </Route>
          </Switch>
        </LeftRightPadding>
      </Sticky>
      <Footer />
    </>
  );
}
