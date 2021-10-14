/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import GoodBadEventsForm from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm';
import { websiteSliTypeOptions } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { MetricsForm } from 'in-custom-dashboards/widgets/Slo/sli/MetricsForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export function WebsiteSliForm({ form, onChange, websiteName }) {
  const sliEntityForm = form.get('sliEntity');

  const sliTypeForm = sliEntityForm.get('sliType');

  return (
    <Stack gap="large">
      <Stack gap="normal">
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

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.sliFormPresenter.sliEntity')}</Header>
      </Stack>

      <MetricsForm form={form} onChange={onChange} />

      <GoodBadEventsForm label={websiteName} form={form} />
    </Stack>
  );
}
