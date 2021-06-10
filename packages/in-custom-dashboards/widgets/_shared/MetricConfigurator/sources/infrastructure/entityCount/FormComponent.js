/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import { aggregationLabels } from 'in-stores/metric/metric';
import Stack from 'in-components/layout/Stack';
import { t } from 'in-i18n';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const dynamicFocusQueryField = form.get('dynamicFocusQuery');

  useEffect(
    () =>
      onChange([], form => {
        if (form.get('metricLabel')) {
          return form.updateIn(['metricLabel'], field =>
            field
              .setValue(t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.count'))
              .setTouched(true)
          );
        }
        return form;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricField]
  );

  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <Sections>
        <InputInSection
          label={t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.query')}
          id="metic-configurator-infra-dynamic-focus-query"
          type="text"
          value={dynamicFocusQueryField.value}
          onChange={e => onChange(['dynamicFocusQuery'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
          actions={
            <HelpAction>
              {t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.helpAction')}
            </HelpAction>
          }
          additionalContent={<TouchedMessages field={dynamicFocusQueryField} />}
          maxLength={512}
        />
      </Sections>

      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.metric')}
          id="metic-configurator-infra-metric"
          value={metricField.value}
          disabled
          additionalContent={<TouchedMessages field={metricField} />}
        >
          <option value="count">
            {t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.count')}
          </option>
        </SelectInSection>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.aggregation')}
          id="metic-configurator-infra-aggregation"
          value={aggregationField.value}
          disabled
          additionalContent={<TouchedMessages field={aggregationField} />}
          useAlternateBg
        >
          {!metricField.valid && (
            <option value="">
              {t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.pleaseSelectMetric')}
            </option>
          )}
          {metricField.valid && (
            <>
              <option value="">
                {t('in-custom-dashboards:widgets.srcInfrastructure.entityCountFormComponent.pleaseSelect')}
              </option>
              {Object.keys(aggregationLabels).map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
      </Sections>
      {formatterSection}

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}
