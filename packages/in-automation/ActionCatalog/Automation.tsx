/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-automation/automationTabs/ViewSwitcher';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

export default function Automation({ children }: { children?: ReactNode }) {
  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>{children}</LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
