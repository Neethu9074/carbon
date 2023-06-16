/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { SloEntityType } from '@instana/types';

import { SloScopeApplicationSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeApplicationSection';
import { SloScopeWebsiteSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeWebsiteSection';
import { isApplicationSloForm, SloForm, SloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType>;
  onChange: (path: SloFormPath<SloEntityType>, updater: (i: Item) => Item) => void;
}

export const SloScopeSection = ({ form, onChange }: SloScopeSectionProps) => {
  if (isApplicationSloForm(form)) return <SloScopeApplicationSection form={form} onChange={onChange} />;

  return <SloScopeWebsiteSection form={form} onChange={onChange} />;
};
