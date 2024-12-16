/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import {
  websiteSliTypeOptions,
  websiteEventBased,
  websiteTimeBased,
  SliEntityType,
  enabledSliBeaconTypes,
  AvailableSliBeaconTypes
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';
import GoodBadEventsConfigurator from 'in-custom-dashboards/widgets/SloLegacy/sli/GoodBadEventsConfigurator';
import BeaconConfigurator from 'in-custom-dashboards/widgets/SloLegacy/sli/BeaconConfigurator';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MetricsForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/MetricsForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

interface WebsiteSliFormProps {
  websiteName: string;
  form: MapForm<any>;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
  QueryBuilderComponent: QueryBuilderComponent;
}

export function WebsiteSliForm({
  form,
  onChange,
  websiteName,
  QueryBuilderComponent: QueryBuilder
}: WebsiteSliFormProps) {
  const sliEntityForm = form.get('sliEntity') as MapForm<any>;
  const sliNameField = form.get('sliName') as Field<string>;

  const sliTypeField = sliEntityForm.get('sliType') as Field<SliEntityType>;
  const beaconTypeField = sliEntityForm.get('beaconType') as Field<AvailableSliBeaconTypes>;

  return (
    <Stack gap="large">
      <Stack component="section" gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomization')}</Header>

        <Stack gap="xsmall">
          <Sections>
            <InputInSection
              id="new-sli-name"
              label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.name')}
              onChange={e => onChange(['sliName'], f => (f as Field<string>).setValue(e.target.value).setTouched(true))}
              value={sliNameField?.value}
              hasError={!sliNameField.valid && sliNameField.touched}
              maxLength={256}
              additionalContent={
                <OverridingFieldValidationMessage
                  field={sliNameField}
                  message={t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliNameNotEmpty')}
                />
              }
            />
          </Sections>

          <Sections>
            <SelectInSection
              id="new-sli-type"
              label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.type')}
              onChange={e =>
                onChange(['sliEntity', 'sliType'], f => (f as Field<string>).setValue(e.target.value).setTouched(true))
              }
              value={sliTypeField?.value ?? ''}
              hasError={!sliTypeField.valid && sliTypeField.touched}
              actions={
                <HelpAction
                  href="https://www.ibm.com/docs/en/obi/current?topic=instana-service-level-objectives-slo#sli-configuration/"
                  external
                >
                  {t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomHelpAction')}
                </HelpAction>
              }
              additionalContent={
                <OverridingFieldValidationMessage
                  field={sliTypeField}
                  message={t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliTimeBasedOrAnEventBasedSli')}
                />
              }
            >
              <option value="">{t('in-custom-dashboards:widgets.slo.sliFormPresenter.pleaseSelect')}</option>
              {websiteSliTypeOptions.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          </Sections>
        </Stack>
      </Stack>

      <Divider />
      <ConfigDialogTimeConfigContextModification>
        <BeaconConfigurator
          beaconOptions={enabledSliBeaconTypes}
          QueryBuilder={QueryBuilder}
          beaconTypeField={beaconTypeField}
          tagFilterExpressionField={sliEntityForm.get('filterExpression') as Field<FormModelElement[]>}
          onChangeBeaconType={newBeaconType =>
            onChange(['sliEntity', 'beaconType'], f => (f as Field<string>).setValue(newBeaconType).setTouched(true))
          }
          onChangeTagFilterExpression={newFilterExpression =>
            onChange(['sliEntity', 'filterExpression'], f =>
              (f as Field<FormModelElement[]>).setValue(newFilterExpression).setTouched(true)
            )
          }
          withAdditionalFilters={sliTypeField.value === websiteTimeBased}
        />
      </ConfigDialogTimeConfigContextModification>
      <Divider />

      {sliTypeField.value === websiteTimeBased && (
        <MetricsForm
          entityType="website"
          metricEntityType={beaconTypeField?.value}
          form={form.get('metricConfiguration') as MapForm<any>}
          onChange={mc => onChange([], f => (f as MapForm<any>).put('metricConfiguration', mc))}
        />
      )}

      {sliTypeField.value === websiteEventBased && (
        <ConfigDialogTimeConfigContextModification>
          <GoodBadEventsConfigurator
            entityType="website"
            label={t('in-custom-dashboards:widgets.slo.goodBadEventsForm.websitesFilterLabel', {
              websiteLabel: websiteName,
              beaconType: t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel', {
                context: beaconTypeField?.value
              })
            })}
            form={sliEntityForm}
            updateForm={updatedForm => onChange([], f => (f as MapForm<any>).put('sliEntity', updatedForm))}
            QueryBuilderComponent={QueryBuilder}
          />
        </ConfigDialogTimeConfigContextModification>
      )}
    </Stack>
  );
}
