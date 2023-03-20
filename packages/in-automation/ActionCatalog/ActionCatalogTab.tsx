/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ActionCatalog from 'in-automation/ActionCatalog/ActionCatalog';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewSwitcher from 'in-automation/automationTabs/ViewSwitcher';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

// const pathSegment = bizOpsPath;
// const matrixPrefix = '';

export default function ActionCatalogTab() {
  // const timeConfig = useTimeConfig();

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <Title title={t('in-automation:automation')} />
        <ActionCatalog />
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

// Currently not getting data
// export function getProcessData() {
//   return just(listSuccess([]));
// }
