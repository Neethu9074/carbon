/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';
import { Stack } from '@instana/components';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import {
  applicationSliTypeOptions,
  applicationType,
  availabilityType,
  SliEntityType
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import BoundaryScopeConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/BoundaryScopeConfigurator';
import HiddenCallsConfigurator from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/HiddenCallsConfigurator';
import EndpointSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/EndpointSelectBox';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';
import ServiceSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ServiceSelectBox';
import GoodBadEventsConfigurator from 'in-custom-dashboards/widgets/SloLegacy/sli/GoodBadEventsConfigurator';
import { MetricsForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/MetricsForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

const titleWidth = '10.938rem';

interface ApplicationSliFormProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
  apName: string;
  QueryBuilderComponent: QueryBuilderComponent;
}

export function ApplicationSliForm({ form, onChange, apName, QueryBuilderComponent }: ApplicationSliFormProps) {
  const sliEntityForm = form.get('sliEntity') as MapForm<any>;

  const sliTypeForm = sliEntityForm.get('sliType') as Field<SliEntityType>;
  const sliType = sliTypeForm.value;
  const endpointIdField = sliEntityForm.get('endpointId') as Field<string | Nullish>;
  const serviceIdField = sliEntityForm.get('serviceId') as Field<string | Nullish>;
  const sliNameField = form.get('sliName') as Field<string>;

  const applicationId = (sliEntityForm.get('applicationId') as Field<string>)?.value;
  const serviceId = serviceIdField?.value;
  const endpointId = endpointIdField?.value;
  const boundaryScope = (sliEntityForm.get('boundaryScope') as Field<ApplicationBoundaryScope>)?.value;
  const includeInternal = (sliEntityForm.get('includeInternal') as Field<boolean>)?.value;
  const includeSynthetic = (sliEntityForm.get('includeSynthetic') as Field<boolean>)?.value;

  const onUpdateBoundaryScope = (value: ApplicationBoundaryScope) => {
    onChange(['sliEntity', 'boundaryScope'], f =>
      (f as Field<ApplicationBoundaryScope>).setValue(value).setTouched(true)
    );
  };

  const onUpdateSliEntityField = <T extends unknown>(fieldName: string, value: T) => {
    onChange(['sliEntity', fieldName], f => (f as Field<T>).setValue(value).setTouched(true));
  };

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
              value={sliType ?? ''}
              hasError={!sliTypeForm.valid && sliTypeForm.touched}
              actions={
                <HelpAction
                  href="https://www.ibm.com/docs/en/obi/current?topic=instana-service-level-objectives-slo#sli-configuration"
                  external
                >
                  {t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomHelpAction')}
                </HelpAction>
              }
              additionalContent={
                <OverridingFieldValidationMessage
                  field={sliTypeForm}
                  message={t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliTimeBasedOrAnEventBasedSli')}
                />
              }
            >
              <option value="">{t('in-custom-dashboards:widgets.slo.sliFormPresenter.pleaseSelect')}</option>
              {applicationSliTypeOptions.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          </Sections>
        </Stack>
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliEntity')}</Header>

        <Stack gap="xsmall">
          <Sections>
            <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.boundary')}>
              <BoundaryScopeConfigurator value={boundaryScope} onChange={onUpdateBoundaryScope} />
            </Section>
          </Sections>
          {sliType === availabilityType && (
            <Sections>
              <Section title={t('in-custom-dashboards:widgets.slo.sliFormPresenter.hiddenCalls')}>
                <HiddenCallsConfigurator
                  includeInternal={includeInternal}
                  includeSynthetic={includeSynthetic}
                  onChangeInternal={() => onUpdateSliEntityField('includeInternal', !includeInternal)}
                  onChangeSynthetic={() => onUpdateSliEntityField('includeSynthetic', !includeSynthetic)}
                />
              </Section>
            </Sections>
          )}
          {sliType === applicationType && (
            <ConfigDialogTimeConfigContextModification>
              <Sections>
                <ServiceSelectBox
                  width={titleWidth}
                  boundaryScope={boundaryScope}
                  applicationId={applicationId}
                  value={serviceId}
                  hasError={!serviceIdField.valid && serviceIdField.touched}
                  onChange={value =>
                    onChange(['sliEntity', 'serviceId'], f =>
                      (f as Field<string | Nullish>).setValue(convertEmptyStringToNull(value)).setTouched(true)
                    )
                  }
                />
              </Sections>

              <Sections>
                <EndpointSelectBox
                  width={titleWidth}
                  boundaryScope={boundaryScope}
                  applicationId={applicationId}
                  serviceId={serviceId}
                  value={endpointId}
                  hasError={!endpointIdField.valid && endpointIdField.touched}
                  onChange={value =>
                    onChange(['sliEntity', 'endpointId'], f =>
                      (f as Field<string | Nullish>).setValue(convertEmptyStringToNull(value)).setTouched(true)
                    )
                  }
                />
              </Sections>
            </ConfigDialogTimeConfigContextModification>
          )}
        </Stack>
      </Stack>

      <Divider />

      {sliType === applicationType && (
        <MetricsForm
          entityType="application"
          metricEntityType="calls"
          form={form.get('metricConfiguration') as MapForm<any>}
          onChange={mc => onChange([], f => (f as MapForm<any>).put('metricConfiguration', mc))}
        />
      )}

      {sliType === availabilityType && (
        <ConfigDialogTimeConfigContextModification>
          <GoodBadEventsConfigurator
            entityType="application"
            label={apName}
            form={sliEntityForm}
            updateForm={updatedForm => onChange([], f => (f as MapForm<any>).put('sliEntity', updatedForm))}
            QueryBuilderComponent={QueryBuilderComponent}
          />
        </ConfigDialogTimeConfigContextModification>
      )}
    </Stack>
  );
}

const convertEmptyStringToNull = (value: string | Nullish): string | Nullish => (value === '' ? null : value);
