/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import SloScopeApplicationSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeApplicationSection';
import SloScopeSyntheticSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeSyntheticSection';
import SloScopeWebsiteSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeWebsiteSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export default function SloScopeSection() {
  const { form } = useContext(SloFormContext);

  const entityType = form.getIn(['entity', 'type']).value;

  if (entityType === 'application') return <SloScopeApplicationSection />;
  if (entityType === 'synthetic') return <SloScopeSyntheticSection />;

  return <SloScopeWebsiteSection />;
}
