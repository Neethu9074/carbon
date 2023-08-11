/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import { SloIndicatorTypeSelectorFormSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorTypeSelectorFormSection';
import { CustomFiltersFormSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/CustomFiltersFormSection';
import { HeadlineFormSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/HeadlineFormSection';

export const SloIndicatorCustomForm = () => {
  return (
    <Stack gap="medium">
      <HeadlineFormSection />
      <SloIndicatorTypeSelectorFormSection />
      <CustomFiltersFormSection />
    </Stack>
  );
};
