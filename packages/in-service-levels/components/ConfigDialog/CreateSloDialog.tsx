/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { just } from '@instana/observables';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import SloNameAndTagsSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloNameAndTagsSection/SloNameAndTagsSection';
import { SloEntitySection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntitySection';
import { SloScopeSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeSection';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useSloFormSideEffects } from 'in-service-levels/hooks/useSloFormSideEffects';
import useFormSubmission from 'in-service-levels/hooks/useFormSubmission';
import ConfigDialog from 'in-service-levels/components/ConfigDialog';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { close } from 'in-components/DialogPresenter/store';
import { NavItem } from 'in-components/SideNav/SideNav';
import { t } from 'in-i18n';

export default function CreateSloDialog() {
  const [form, setForm] = useState(createSloForm({ entityType: 'application' }));
  const updateForm = useSloFormSideEffects(form, setForm as (f: Item) => void);
  const [, doSubmit] = useFormSubmission(() => just(pendingResult));

  const nameField = form.getIn(['nameTags', 'name']);
  const isNameInvalid = !nameField.valid && (nameField.touched || form.touched);

  const navItems: Array<NavItem> = [
    {
      content: <SloEntitySection form={form} onChange={(path, fn) => updateForm(form.updateIn(path, fn))} />,
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      scrollId: '1-select-entity',
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: true
    },
    {
      content: (
        <ConfigDialogTimeConfigContextModification>
          <SloScopeSection form={form} onChange={(path, fn) => updateForm(form.updateIn(path, fn))} />
        </ConfigDialogTimeConfigContextModification>
      ),
      label: t('in-service-levels:createSloDialog.selectScopeNavItem'),
      scrollId: '2-select-scope',
      title: t('in-service-levels:createSloDialog.selectScopeNavItem'),
      valid: true
    },
    {
      content: (
        <SloNameAndTagsSection
          form={form}
          onChange={(path, fn) => updateForm(form.updateIn(path, fn))}
          hasError={isNameInvalid}
        />
      ),
      label: t('in-service-levels:createSloDialog.nameAndTagsNavItem'),
      scrollId: '3-name-and-tags',
      title: t('in-service-levels:createSloDialog.nameAndTagsNavItem'),
      valid: !isNameInvalid
    }
  ];

  return (
    <ConfigDialog
      title={t('in-service-levels:createSloDialog.title')}
      navItems={navItems}
      onClose={close}
      onSave={() => {
        updateForm(form.setTouched(true));
        doSubmit({
          payload: {},
          onError: noop,
          onSuccess: noop
        });
      }}
      noHeader
      noDivider
    />
  );
}
