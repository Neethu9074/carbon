/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import { SloIndicatorTypeSelectorFormSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorTypeSelectorFormSection';
import { AggregationAndThresholdFormSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/AggregationAndThresholdFormSection';
import { HeadlineFormSection } from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/HeadlineFormSection';

export const SloIndicatorAvailabilityForm = () => {
  return (
    <Stack gap="medium">
      <HeadlineFormSection />
      <SloIndicatorTypeSelectorFormSection />
      <AggregationAndThresholdFormSection />
    </Stack>
  );
};
