/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-automation/AutomationTabs/ViewSwitcher';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

interface AutomationTabsProps {
  children: ReactNode;
}

export default function AutomationTabs({ children }: AutomationTabsProps) {
  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>{children}</LeftRightPadding>
      <Footer />
    </Sticky>
  );
}
