/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { IndicatorApplicationCustomFilters } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/IndicatorApplicationCustomFilters';
import { IndicatorWebsiteCustomFilters } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/IndicatorWebsiteCustomFilters';
import { SloFormContext } from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export const CustomFiltersFormSection = () => {
  const { form } = useContext(SloFormContext);

  const entityTypeField = form.getIn(['entity', 'type']);

  if (entityTypeField.value === 'application') return <IndicatorApplicationCustomFilters />;

  return <IndicatorWebsiteCustomFilters />;
};
