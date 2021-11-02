/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import GoodBadEventsConfigurator from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsConfigurator';
import BeaconConfigurator from 'in-custom-dashboards/widgets/Slo/sli/BeaconConfigurator';
import { websiteSliTypeOptions } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/sli/MetricsForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export function WebsiteSliForm({ form, onChange, websiteName, QueryBuilderComponent: QueryBuilder }) {
  const sliEntityForm = form.get('sliEntity');
  const sliTypeForm = sliEntityForm.get('sliType');

  return (
    <Stack gap="large">
      <Stack component="section" gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomization')}</Header>

        <Stack gap="xsmall">
          <Sections>
            {form.get('sliName').map(field => (
              <InputInSection
                id="new-sli-name"
                label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.name')}
                onChange={e => onChange(['sliName'], f => f.setValue(e.target.value).setTouched(true))}
                value={field?.value}
                hasError={!field.valid && field.touched}
                maxLength={256}
                additionalContent={
                  <OverridingTextTouchedMessage
                    field={field}
                    message={t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliNameNotEmpty')}
                  />
                }
              />
            ))}
          </Sections>

          <Sections>
            {sliEntityForm.get('sliType').map(field => (
              <SelectInSection
                id="new-sli-type"
                label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.type')}
                onChange={e => onChange(['sliEntity', 'sliType'], f => f.setValue(e.target.value).setTouched(true))}
                value={field?.value ?? ''}
                hasError={!field.valid && field.touched}
                actions={
                  <HelpAction href="https://instana.com/docs/service_level_objectives/#sli-configuration/" external>
                    {t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliCustomHelpAction')}
                  </HelpAction>
                }
                additionalContent={
                  <OverridingTextTouchedMessage
                    field={sliTypeForm}
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
            ))}
          </Sections>
        </Stack>
      </Stack>
      <Divider />
      <BeaconConfigurator QueryBuilder={QueryBuilder} form={form} onChange={onChange} />

      <MetricsForm
        entityType="website"
        metricEntityType={form.get('sliEntity').get('beaconType').value}
        form={form}
        onChange={onChange}
      />
      <GoodBadEventsConfigurator
        entityType="website"
        label={t('in-custom-dashboards:widgets.slo.goodBadEventsForm.websitesFilterLabel', {
          websiteLabel: websiteName,
          beaconType: t('in-custom-dashboards:widgets.slo.sliFormPresenter.httpRequestsLabel')
        })}
        form={form}
        QueryBuilderComponent={QueryBuilder}
      />
    </Stack>
  );
}
