/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Spacer, Toggle } from '@instana/components';
import { useObservable } from '@instana/hooks';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { refreshDFQ$ } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
//@ts-expect-error
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-components/workspace/HelpAction';
import { aggregationLabels } from 'in-stores/metric/metric';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from './FormComponent.mless';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration,
  thresholdConfiguration,
  withAggregationInMetrics = true,
  displayDFQ = true
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const dynamicFocusQueryField = form.get('dynamicFocusQuery');
  const includeK8sInfoEventsField = form.get('includeK8sInfoEvents');
  const includeAgentMonitoringIssuesField = form.get('includeAgentMonitoringIssues');

  const refreshDFQ = useObservable(refreshDFQ$, []);

  const dfqInput = displayDFQ ? (
    <Section title={t('in-custom-dashboards:widgets.srcEvent.formComponent.query')}>
      <Stack direction="horizontal" align="center" distribution="stretch" gap="normal">
        <DfqSearchBar
          id="metic-configurator-event-dynamic-focus-query"
          theme="light"
          onQueryValueChange={value => onChange(['dynamicFocusQuery'], field => field.setValue(value).setTouched(true))}
          queryValue={dynamicFocusQueryField.value}
          manageFiltersDisabled
          refreshDFQ={refreshDFQ}
        />
        <HelpAction>{t('in-custom-dashboards:widgets.srcEvent.formComponent.helpAction')}</HelpAction>
      </Stack>
    </Section>
  ) : (
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
  );

  return (
    <Stack gap="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <Sections>
        {dfqInput}
        <Section useAlternateBg>
          <HorizontalFlexWrapper>
            <Toggle
              id="select-k8s-info-events"
              checked={includeK8sInfoEventsField.value}
              onToggle={e => onChange(['includeK8sInfoEvents'], field => field.setValue(e).setTouched(true))}
            />
            <Spacer horizontal="xxsmall" />
            <span>{t('in-custom-dashboards:widgets.srcEvent.formComponent.includeK8sInfoEvents')}</span>
            <Toggle
              className={locals.agentMonitoringIssuesToggle}
              id="select-agent-monitoring-issues"
              checked={includeAgentMonitoringIssuesField.value}
              onToggle={e => onChange(['includeAgentMonitoringIssues'], field => field.setValue(e).setTouched(true))}
            />
            <Spacer horizontal="xxsmall" />
            <span>{t('in-custom-dashboards:widgets.srcEvent.formComponent.includeAgentMonitoringIssues')}</span>
          </HorizontalFlexWrapper>
        </Section>
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
        {withAggregationInMetrics && (
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
        )}

        {formatterSection}
      </Sections>

      {timeShiftConfiguration}

      {thresholdConfiguration}

      {labelSection}
    </Stack>
  );
}
