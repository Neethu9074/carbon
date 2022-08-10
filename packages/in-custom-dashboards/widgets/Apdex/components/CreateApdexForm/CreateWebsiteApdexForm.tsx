/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Spacer, Stack } from '@instana/components';

import {
  apdexEntityKey,
  apdexNameKey,
  tagFilterExpressionKey,
  thresholdKey,
  toApdexConfigurationInput
} from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import {
  useValidateWebsiteFilterExpression,
  useWebsiteQueryBuilder
} from 'in-custom-dashboards/widgets/Slo/sli/hooks/useWebsiteQueryBuilder';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import { CreateApdexFormComponentProps } from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/CreateApdexForm';
import useSetFormFooterEffect from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSetFormFooterEffect';
import ApdexConfigPreview from 'in-custom-dashboards/widgets/Apdex/components/ApdexConfigPreview';
import { entityIdKey, getField, setFieldValue } from 'in-custom-dashboards/widgets/Apdex/form';
import BeaconConfigurator from 'in-custom-dashboards/widgets/Slo/sli/BeaconConfigurator';
import PreviewHeader from 'in-custom-dashboards/widgets/Apdex/components/PreviewHeader';
import PreviewFooter from 'in-custom-dashboards/widgets/Apdex/components/PreviewFooter';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import InputInSection from 'in-components/form/Input/InputInSection';
import Sections from 'in-components/workspace/Sections/Sections';
import Header from 'in-components/workspace/Header/Header';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

export default function CreateWebsiteApdexForm({
  isSaving,
  form,
  onSubmit,
  onChange,
  onCancel,
  setFooter,
  isEditing
}: CreateApdexFormComponentProps) {
  const entityId = getField<string>(form, [apdexEntityKey, entityIdKey])!.value;
  const { QueryBuilder, isQueryValid } = useWebsiteQueryBuilder({ beaconType: 'httpRequest', websiteId: entityId });

  const filterExpression = getField<FormModelElement[]>(form, [apdexEntityKey, tagFilterExpressionKey])?.value;

  const isFilterExpressionValid = useValidateWebsiteFilterExpression({
    filterExpression,
    isQueryValid
  });

  const canSave = form.hierarchyTouched && form.hierarchyValid && isFilterExpressionValid;

  useSetFormFooterEffect({
    form,
    formId: 'createApdexForm',
    isDisabled: !canSave,
    cloneOnly: isEditing,
    isSaving,
    onCancel,
    setFooter
  });

  const apdexNameField = getField<string>(form, [apdexNameKey]);
  const thresholdField = getField<number>(form, [apdexEntityKey, thresholdKey]);
  const apdexName = apdexNameField?.value;
  const threshold = thresholdField?.value;

  return (
    <Form form={form} setForm={f => onChange([], () => f)} onSubmit={onSubmit} formId="createApdexForm">
      <Stack gap="large">
        <Stack component="section" gap="normal">
          <Header>{t('in-custom-dashboards:widgets.apdex.createApdexForm.customizationHeader')}</Header>

          <Stack gap="xsmall">
            <Sections>
              <InputInSection
                id="new-apdex-name"
                label={t('in-custom-dashboards:widgets.apdex.createApdexForm.label')}
                onChange={e => onChange([apdexNameKey], item => setFieldValue(item, e.target.value, true))}
                value={apdexName}
                hasError={!apdexNameField?.valid && apdexNameField?.touched}
                maxLength={256}
                additionalContent={
                  <OverridingFieldValidationMessage
                    field={apdexNameField}
                    message={t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexNameNotEmpty')}
                  />
                }
              />
            </Sections>
          </Stack>
        </Stack>

        <BeaconConfigurator
          QueryBuilder={QueryBuilder}
          value={filterExpression ?? []}
          onChange={expression =>
            onChange([apdexEntityKey, tagFilterExpressionKey], item => setFieldValue(item, expression, true))
          }
          withAdditionalFilters
        />

        <Stack component="section" gap="normal">
          <Header>{t('in-custom-dashboards:widgets.apdex.createWebsiteApdexForm.thresholdHeader')}</Header>
          <Stack component="section" gap="xsmall">
            <Sections>
              <PreviewHeader
                threshold={threshold}
                onChangeThreshold={threshold =>
                  onChange([apdexEntityKey, thresholdKey], item => setFieldValue(item, threshold, true))
                }
                hasError={!thresholdField?.valid && thresholdField?.touched}
                additionalContent={
                  <OverridingFieldValidationMessage
                    field={thresholdField}
                    message={t('in-custom-dashboards:widgets.apdex.createApdexForm.thresholdNotEmpty')}
                  />
                }
              />
              <ApdexConfigPreview
                apdexEntity={isFilterExpressionValid ? toApdexConfigurationInput(form).apdexEntity : undefined}
              />
              {isEditing && <PreviewFooter />}
            </Sections>
          </Stack>
        </Stack>
      </Stack>

      <Spacer size="large" />
    </Form>
  );
}
