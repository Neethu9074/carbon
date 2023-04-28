/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SelectEntity from 'in-service-levels/components/SloList/components/SelectEntity';
import ConfigDialog from 'in-service-levels/components/ConfigDialog';
import { close } from 'in-components/DialogPresenter/store';
import { NavItem } from 'in-components/SideNav/SideNav';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function CreateSloDialog() {
  const navItems: Array<NavItem> = [
    {
      scrollId: '1-select-entity',
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: true,
      content: (
        <>
          <SelectEntity />
        </>
      )
    }
  ];

  return (
    <ConfigDialog
      title={t('in-service-levels:createSloDialog.title')}
      navItems={navItems}
      onClose={close}
      onSave={noop}
      noHeader
      noDivider
    />
  );
}
