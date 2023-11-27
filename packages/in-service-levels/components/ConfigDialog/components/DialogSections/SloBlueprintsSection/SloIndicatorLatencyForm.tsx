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

export default function SloIndicatorLatencyForm() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const aggregationField = form.getIn(['indicator', 'aggregation']);
  const thresholdField = form.getIn(['indicator', 'threshold']);

  const blueprint = form.getIn(['indicator', 'blueprint']).value;
  const indicatorType = form.getIn(['indicator', 'type']).value;

  const isTimeBased = indicatorType === 'timeBased';
  const isEventBased = indicatorType === 'eventBased';
  const isFormInEditMode = mode === 'EDIT';

  return (
    <Stack gap="medium">
      <HeadlineFormSection />
      <SloIndicatorTypeSelectorFormSection />
      <IndicatorFieldsSection>
        {/* Time-based SLI fields */}
        {isTimeBased && (
          <IndicatorAggregationField disabled={isFormInEditMode} field={aggregationField} onChange={onChange} />
        )}
        {isTimeBased && (
          <IndicatorThresholdField
            blueprint={blueprint}
            disabled={isFormInEditMode}
            field={thresholdField}
            onChange={onChange}
          />
        )}
        {/* Event-based SLI fields */}
        {isEventBased && (
          <IndicatorThresholdField
            blueprint={blueprint}
            disabled={isFormInEditMode}
            field={thresholdField}
            onChange={onChange}
          />
        )}
      </IndicatorFieldsSection>
    </Stack>
  );
}
