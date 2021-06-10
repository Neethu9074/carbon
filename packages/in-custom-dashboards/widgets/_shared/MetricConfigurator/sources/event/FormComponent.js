/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

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

  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <Sections>
        <InputInSection
          label={t('in-custom-dashboards:widgets.srcEvent.formComponent.query')}
          id="metic-configurator-event-dynamic-focus-query"
          type="text"
          value={dynamicFocusQueryField.value}
          onChange={e => onChange(['dynamicFocusQuery'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
          additionalContent={<TouchedMessages field={dynamicFocusQueryField} />}
          actions={<HelpAction>{t('in-custom-dashboards:widgets.srcEvent.formComponent.helpAction')}</HelpAction>}
          maxLength={512}
        />
      </Sections>

      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcEvent.formComponent.metric')}
          id="metic-configurator-event-metric"
          value={metricField.value}
          disabled
          additionalContent={<TouchedMessages field={metricField} />}
        >
          <option value="eventCount">{t('in-custom-dashboards:widgets.srcEvent.formComponent.eventCount')}</option>
        </SelectInSection>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcEvent.formComponent.aggregation')}
          id="metic-configurator-event-aggregation"
          value={aggregationField.value}
          disabled
          additionalContent={<TouchedMessages field={aggregationField} />}
          useAlternateBg
        >
          {!metricField.valid && (
            <option value="">{t('in-custom-dashboards:widgets.srcEvent.formComponent.pleaseSelectMetric')}</option>
          )}
          {metricField.valid && (
            <>
              <option value="">{t('in-custom-dashboards:widgets.srcEvent.formComponent.pleaseSelect')}</option>
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
