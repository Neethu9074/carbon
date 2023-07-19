/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloScopeApplicationSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeApplicationSection';
import { SloScopeWebsiteSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeWebsiteSection';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface SloScopeSectionProps {
  form: SloForm;
  onChange: SloFormOnChange;
}

export const SloScopeSection = ({ form, onChange }: SloScopeSectionProps) => {
  const entityType = form.getIn(['entity', 'type']).value;

  if (entityType === 'application') return <SloScopeApplicationSection form={form} onChange={onChange} />;

  return <SloScopeWebsiteSection form={form} onChange={onChange} />;
};
