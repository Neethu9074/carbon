/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { SloEntitySection } from 'in-service-levels/components/ConfigDialog/DialogSections/SloEntitySection/SloEntitySection';
import { useSloFormSideEffects } from 'in-service-levels/hooks/useSloFormSideEffects';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/form';
import ConfigDialog from 'in-service-levels/components/ConfigDialog';
import { close } from 'in-components/DialogPresenter/store';
import { NavItem } from 'in-components/SideNav/SideNav';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function CreateSloDialog() {
  const [form, setForm] = useState(createSloForm({ entityType: 'application' }));

  const updateForm = useSloFormSideEffects(form, setForm as (f: Item) => void);
  const navItems: Array<NavItem> = [
    {
      scrollId: '1-select-entity',
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: true,
      content: (
        <>
          <SloEntitySection
            form={form}
            onChange={(path, fn) => {
              updateForm(form.updateIn(path as any, fn));
            }}
          />
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
