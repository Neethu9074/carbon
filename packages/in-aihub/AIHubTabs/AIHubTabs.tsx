/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode } from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-aihub/AIHubTabs/ViewSwitcher';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';

interface AIHubTabsProps {
  children: ReactNode;
}

export default function AIHubTabs({ children }: AIHubTabsProps) {
  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>{children}</LeftRightPadding>
      <Footer />
    </Sticky>
  );
}
