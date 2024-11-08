/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack } from '@instana/components';

import SloIndicatorTypeSelectorFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloIndicatorTypeSelectorFormSection';
import IndicatorAggregationField from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/IndicatorAggregationField';
import IndicatorThresholdField from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/IndicatorThresholdField';
import IndicatorFieldsSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/IndicatorFieldsSection';
import HeadlineFormSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/HeadlineFormSection';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export default function SloIndicatorAvailabilityForm() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const aggregationField = form.getIn(['indicator', 'aggregation']);
  const thresholdField = form.getIn(['indicator', 'threshold']);

  const blueprint = form.getIn(['indicator', 'blueprint']).value;
  const entityType = form.getIn(['entity', 'type']).value;
  const indicatorType = form.getIn(['indicator', 'type']).value;

  const isFormInEditMode = mode === 'EDIT';
  const isSyntheticEntity = entityType === 'synthetic';
  const isTimeBased = indicatorType === 'timeBased';

  return (
    <Stack gap="medium">
      <HeadlineFormSection />
      <SloIndicatorTypeSelectorFormSection />
      <IndicatorFieldsSection>
        {/* Time-based SLI fields */}
        {isTimeBased && !isSyntheticEntity && (
          <IndicatorAggregationField
            availableOptions={['MEAN']}
            field={aggregationField}
            onChange={onChange}
            disabled={isFormInEditMode}
          />
        )}
        {isTimeBased && (
          <IndicatorThresholdField
            blueprint={blueprint}
            field={thresholdField}
            onChange={onChange}
            disabled={isFormInEditMode}
            percentageValue
          />
        )}
      </IndicatorFieldsSection>
    </Stack>
  );
}
