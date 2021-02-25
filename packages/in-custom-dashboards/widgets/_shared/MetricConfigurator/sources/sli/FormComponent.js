/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Trans, t } from 'in-i18n';
import React from 'react';

import * as serviceLevelIndicators from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/serviceLevelIndicators';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { percentage } from 'in-services/formatters/number';
import Stack from 'in-new-components/layout/Stack';
import useObservable from 'in-hooks/useObservable';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration
}) {
  const { data: sliConfigurations } = useObservable(() => getSliConfigurations(), []) ?? {};
  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>

      {form.get('sliConfigId').map(field => (
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcSli.formComp.configSli')}
            id="metric-configurator-sli-id"
            value={field.value}
            onChange={e =>
              onChange([], form =>
                form.updateIn(['sliConfigId'], field => field.setValue(e.target.value).setTouched(true))
              )
            }
            hasError={!field.valid && field.touched}
            actions={
              <HelpAction>
                {t('in-custom-dashboards:widgets.srcSli.formComp.sliConfigComputeErrBudgetSliVal')}
              </HelpAction>
            }
            additionalContent={<TouchedMessages field={field} />}
          >
            <option value="">{t('in-custom-dashboards:widgets.srcSli.formComp.pleaseSelect')}</option>
            {sliConfigurations &&
              sliConfigurations.map(({ id, sliName }) => (
                <option key={id} value={id}>
                  {sliName}
                </option>
              ))}
          </SelectInSection>
        </Sections>
      ))}

      {form.get('slo').map(field => (
        <Sections>
          <InputInSection
            label="SLO"
            id="metric-configurator-slo"
            type="number"
            value={
              typeof field.value === 'number'
                ? parseFloat(Number.parseFloat(field.value * 100).toPrecision(6))
                : field.value
            }
            onChange={e => {
              let newValue = undefined;
              if (e.target.value !== '' && !isNaN(e.target.valueAsNumber)) {
                newValue = parseFloat((e.target.valueAsNumber / 100).toPrecision(6));
              }
              onChange(['slo'], field => field.setValue(newValue).setTouched(true));
            }}
            hasError={!field.valid && field.touched}
            min={0}
            max={99.99}
            step="any"
            actions={
              <HelpAction>
                <Trans
                  i18nKey="in-custom-dashboards:widgets.srcSli.formComp.typeSloThreshold"
                  values={{ compact: percentage.compact(0), detailed: percentage.detailed(0.9999) }}
                />
              </HelpAction>
            }
            additionalContent={<TouchedMessages field={field} />}
          />
        </Sections>
      ))}

      {form.get('metric').map(field => (
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcSli.formComp.valType')}
            id="metric-configurator-metric"
            value={field.value}
            onChange={e =>
              onChange([], form => form.updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true)))
            }
            hasError={!field.valid && field.touched}
            additionalContent={<TouchedMessages field={field} />}
          >
            <option value="">{t('in-custom-dashboards:widgets.srcSli.formComp.pleaseSelect')}</option>
            {Object.keys(serviceLevelIndicators)
              .sort((a, b) => compareIgnoreCase(serviceLevelIndicators[a], serviceLevelIndicators[b]))
              .map(key => (
                <option key={key} value={key}>
                  {serviceLevelIndicators[key]}
                </option>
              ))}
          </SelectInSection>
        </Sections>
      ))}

      {formatterSection}
      {timeShiftConfiguration}
      {labelSection}
    </Stack>
  );
}
