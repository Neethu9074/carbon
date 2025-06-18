/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, ValidationBlock } from '@instana/components';

import SloIndicatorTypeSelectorFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorTypeSelectorFormSection';
import CustomFiltersFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/CustomFiltersFormSection';
import HeadlineFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/HeadlineFormSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { isFieldValid } from 'in-service-levels/utils/form';

export default function SloIndicatorCustomForm() {
  const { form } = useContext(SloFormContext);

  const indicatorField = form.get('indicator');
  const isIndicatorFormValid = isFieldValid(indicatorField);

  return (
    <Stack gap="medium">
      <HeadlineFormSection />
      <SloIndicatorTypeSelectorFormSection />
      <CustomFiltersFormSection />
      {!isIndicatorFormValid &&
        indicatorField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
