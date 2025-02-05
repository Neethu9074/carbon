/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, Item } from 'formalistic';
import React, { useEffect } from 'react';

import { Spacer, Stack, CarbonInlineLoading } from '@instana/components';
import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { SloMetric, sloMetrics } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/slo/metrics';
import SloListSelection from 'in-service-levels/components/Shared/SloListSelection/SloListSelection';
import { SloForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/slo/form';
import SloEntityTypeSelector from 'in-service-levels/components/Shared/SloEntityTypeSelector';
import { SLO2_BIG_NUMBER_WIDGET_EDIT_START } from 'in-services/tracking/eventNames';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { compareIgnoreCase } from 'in-services/util/string';
import { pageNames } from 'in-services/tracking/pageNames';
import Sections from 'in-components/workspace/Sections';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

function useSloConfig(configId?: string) {
  return useObservable(() => {
    if (!configId) return just(undefined);
    return getSloConfiguration(configId);
  }, [configId]);
}

interface SloFormComponentProps {
  form: SloForm;
  onChange: (path: string[], updater: (field: Item) => Item) => void;
  dataSourceSection: JSX.Element;
  formatterSection: JSX.Element;
  thresholdConfiguration: JSX.Element;
  labelSection: JSX.Element;
}

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  thresholdConfiguration,
  formatterSection
}: SloFormComponentProps) {
  const updateMetricConfigurationForm = (updatedForm: SloForm) => onChange([], () => updatedForm);
  const { trackCta } = useSegmentTracking();

  useEffect(() => {
    trackCta(
      SLO2_BIG_NUMBER_WIDGET_EDIT_START,
      {
        productArea: productAreas.custom_dashboard,
        pageName: pageNames.custom_dashboard
      },
      undefined
    );
  }, [trackCta]);

  const entityTypeField = form.getIn(['entityType']);
  const configIdField = form.getIn(['configId']);
  const metricField = form.getIn(['metric']);

  const configId = configIdField.value;

  const config = useSloConfig(configId);

  const loading = (config || false) && isLoading(config);

  const updateThreshold = (config: ServiceLevelObjectiveConfiguration, metric: string) => {
    const thresholdEnabled = form.getIn(['threshold', 'thresholdEnabled']).value;
    if (!thresholdEnabled) return form;
    let updatedForm = form;
    const operator = updatedForm.getIn(['threshold', 'operator']).value;
    const isLT = operator === '<';
    if (!isLT) {
      updatedForm = updatedForm.updateIn(['threshold', 'operator'], field => field.setValue('<'));
    }
    const levelToSet = isLT ? 'critical' : 'warning';
    const levelToClear = isLT ? 'warning' : 'critical';
    if (config.indicator.type === 'timeBased' && metric === 'ERROR_BUDGET_REMAINING') {
      updatedForm = updatedForm.updateIn(['threshold', levelToSet], field =>
        field.setValue(config.indicator.threshold.toString())
      );
    } else if (metric === 'STATUS') {
      updatedForm = updatedForm.updateIn(['threshold', levelToSet], field => field.setValue(config.target.toString()));
    }
    updatedForm = updatedForm.updateIn(['threshold', levelToClear], field => field.setValue(''));
    return updatedForm;
  };

  useEffect(() => {
    const data = config?.data;
    const metric = metricField.value;
    if (data && metric) {
      updateMetricConfigurationForm(updateThreshold(data, metric));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Stack gap="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <ViewTrackingMeta data={{ productArea: productAreas.custom_dashboard, pageName: pageNames.custom_dashboard }} />
      <Stack direction="vertical" distribution="spaceEvenly" wrap>
        <Spacer />
        <Stack direction="horizontal" distribution="spaceBetween" wrap>
          <SloEntityTypeSelector
            onChange={entityType =>
              updateMetricConfigurationForm(
                form
                  .updateIn(['entityType'], field => field.setValue(entityType).setTouched(true))
                  .updateIn(['configId'], field => field.setValue('').setTouched(false))
              )
            }
            value={entityTypeField.value ?? 'application'}
            disabled={entityTypeField.value === undefined}
          />
        </Stack>
        <SloListSelection
          entityTypeField={entityTypeField}
          sloIdsField={configIdField}
          onChange={f =>
            updateMetricConfigurationForm(
              form.updateIn(['configId'], field => field.setValue((f as Field<string>).value).setTouched(true))
            )
          }
        />
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcSli.formComp.valType')}
            id="metric-configurator-metric"
            value={metricField.value}
            onChange={e => {
              const metric = e.target.value;
              const data = config?.data;
              if (data) {
                updateMetricConfigurationForm(
                  updateThreshold(data, metric).updateIn(['metric'], field => field.setValue(metric).setTouched(true))
                );
              } else {
                updateMetricConfigurationForm(
                  form.updateIn(['metric'], field => field.setValue(metric).setTouched(true))
                );
              }
            }}
            hasError={!metricField.valid && metricField.touched}
            additionalContent={<TouchedMessages field={metricField} />}
          >
            <option value="">{t('in-custom-dashboards:widgets.srcSli.formComp.pleaseSelect')}</option>
            {(Object.keys(sloMetrics) as SloMetric[])
              .sort((a, b) => compareIgnoreCase(sloMetrics[a].label, sloMetrics[b].label))
              .map(key => (
                <option key={key} value={key}>
                  {sloMetrics[key].label}
                </option>
              ))}
          </SelectInSection>
          {loading && (
            <Stack direction="horizontal" distribution="center">
              <Spacer horizontal="small" />
              <CarbonInlineLoading />
            </Stack>
          )}
          {(!loading || !config) && formatterSection}
        </Sections>
      </Stack>
      {thresholdConfiguration}
      {labelSection}
    </Stack>
  );
}
