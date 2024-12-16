/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import * as serviceLevelIndicators from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/serviceLevelIndicators';
import { recreateSloField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/form';
import { getWebsiteConfigurations as getWebsiteConfigsAsResultObservable } from 'in-websites/api/websites';
import { getSliConfigurations } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import DropdownButton from 'in-components/Button/DropdownButton';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { indeterminateProgress } from 'in-services/fixedObjects';
import HelpAction from 'in-components/workspace/HelpAction';
import { compareIgnoreCase } from 'in-services/util/string';
import { percentage } from 'in-services/formatters/number';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Overlay from 'in-components/overlays/Overlay';
import { all } from 'in-hooks/utils/progress';
import { Trans, t } from 'in-i18n';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  thresholdConfiguration,
  timeShiftConfiguration
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: sliConfigurations = [], progress: sliConfigProgress = indeterminateProgress } =
    useObservable(() => getSliConfigurations(), []) ?? {};
  const { data: applicationConfigs = [], progress: applicationsProgress = indeterminateProgress } =
    useObservable(() => getApplicationConfigsAsResultObservable(), []) ?? {};
  const { data: websiteConfigs = [], progress: websitesProgress = indeterminateProgress } =
    useObservable(() => getWebsiteConfigsAsResultObservable(), []) ?? {};
  const metric = form.get('metric').value;
  const showSlo = metric && metric !== 'SLI';

  useEffect(() => {
    const withValidators = metric === 'ERROR_BUDGET_REMAINING';
    onChange?.([], form => recreateSloField(form, withValidators));
    // may lead to infinite loop when onChange is added to the dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric]);

  const progress = all(sliConfigProgress, applicationsProgress, websitesProgress);
  const entityConfigs = [...applicationConfigs, ...websiteConfigs];

  return (
    <Stack gap="xsmall">
      <Sections>{dataSourceSection}</Sections>
      {form.get('sliConfigId').map(field => {
        const selectedSliConfig = sliConfigurations.find(({ id }) => id === field.value);
        const options = getDropdownOptions(entityConfigs, sliConfigurations);
        const buttonLabel =
          selectedSliConfig?.sliName ?? t('in-custom-dashboards:widgets.srcSli.formComp.pleaseSelect');
        return (
          <Sections>
            <Section
              title={t('in-custom-dashboards:widgets.srcSli.formComp.configSli')}
              id="metric-configurator-sli-id"
              actions={[
                <HelpAction>
                  {t('in-custom-dashboards:widgets.srcSli.formComp.sliConfigComputeErrBudgetSliVal')}
                </HelpAction>
              ]}
            >
              <Overlay
                content={({ close }) => (
                  <SelectorOverlay
                    options={options}
                    loading={progress.loading}
                    onChange={({ id }) => {
                      onChange([], form =>
                        form.updateIn(['sliConfigId'], field => field.setValue(id).setTouched(true))
                      );
                      close();
                    }}
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    shouldTriggerWindowResize
                    strict
                    withIcons
                  />
                )}
                align="bottomLeft"
                withoutWrapper
              >
                {({ toggle, refSetter }) => (
                  <DropdownButton kind="secondary" onClick={toggle} refSetter={refSetter}>
                    {buttonLabel}
                  </DropdownButton>
                )}
              </Overlay>
            </Section>
          </Sections>
        );
      })}
      {form.get('metric').map(field => (
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcSli.formComp.valType')}
            id="metric-configurator-metric"
            value={field.value}
            onChange={e => {
              onChange([], form => form.updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true)));
            }}
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
          {formatterSection}
        </Sections>
      ))}
      {showSlo &&
        form.get('slo').map(field => (
          <Sections>
            <InputInSection
              label={t('in-custom-dashboards:widgets.slo.slo')}
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
      {timeShiftConfiguration}
      {thresholdConfiguration}
      {labelSection}
    </Stack>
  );
}

function getEntityType(sliType) {
  if (sliType === 'websiteEventBased' || sliType === 'websiteTimeBased') return 'website';
  return 'application';
}

function getDropdownOptions(entityConfigs, sliConfigs) {
  const categories = {};

  sliConfigs.forEach(({ id: sliConfigId, sliName, sliEntity }) => {
    const entityType = getEntityType(sliEntity.sliType);
    const entityId = sliEntity[`${entityType}Id`];

    if (!(entityId in categories)) {
      const label = findEntityLabel(entityConfigs, entityId, entityType);
      categories[entityId] = {
        id: entityId,
        label,
        children: [],
        icon: `lib_${entityType}`
      };
    }
    const applicationLabel = categories[entityId].label;
    const parentLabels = [applicationLabel];
    categories[entityId].children.push({ id: sliConfigId, label: sliName, parentLabels });
  });

  return Object.values(categories);
}

function findEntity(entityConfigs, entityId) {
  return entityConfigs.find(({ id }) => id === entityId);
}

function findEntityLabel(entityConfigs, entityId, entityType) {
  const entity = findEntity(entityConfigs, entityId);

  if (!entity) {
    return t('in-custom-dashboards:widgets.unknownEntityLabel', { context: entityType });
  }

  if (entityType === 'website') return entity.name;

  return entity.label;
}
