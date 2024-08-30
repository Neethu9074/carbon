/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import {
  apdexEntityKey,
  apdexNameKey,
  beaconTypeKey,
  tagFilterExpressionKey,
  thresholdKey,
  toApdexConfigurationInput
} from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/SloLegacy/components/OverridingFieldValidationMessage';
import {
  useValidateWebsiteFilterExpression,
  useWebsiteQueryBuilder
} from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { CreateApdexFormComponentProps } from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/CreateApdexForm';
// eslint-disable-next-line import/no-deprecated
import { getField } from 'in-custom-dashboards/widgets/SloLegacy/form';
import EditConfigNotice from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/EditConfigNotice';
import useSetFormFooterEffect from 'in-custom-dashboards/widgets/SloLegacy/sli/hooks/useSetFormFooterEffect';
import ApdexConfigPreview from 'in-custom-dashboards/widgets/Apdex/components/ApdexConfigPreview';
import { AvailableApdexBeaconTypes } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import BeaconConfigurator from 'in-custom-dashboards/widgets/SloLegacy/sli/BeaconConfigurator';
import PreviewHeader from 'in-custom-dashboards/widgets/Apdex/components/PreviewHeader';
import PreviewFooter from 'in-custom-dashboards/widgets/Apdex/components/PreviewFooter';
import { enabledApdexBeaconTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { entityIdKey, setFieldValue } from 'in-custom-dashboards/widgets/Apdex/form';
import InputInSection from 'in-components/form/Input/InputInSection';
import Sections from 'in-components/workspace/Sections/Sections';
import TouchedMessages from 'in-components/form/TouchedMessages';
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
  // eslint-disable-next-line import/no-deprecated
  const beaconTypeField = getField<AvailableApdexBeaconTypes>(form, [apdexEntityKey, beaconTypeKey]);
  // eslint-disable-next-line import/no-deprecated
  const filterExpressionField = getField<FormModelElement[]>(form, [apdexEntityKey, tagFilterExpressionKey]);

  // eslint-disable-next-line import/no-deprecated
  const entityId = getField<string>(form, [apdexEntityKey, entityIdKey])!.value;

  const { QueryBuilder, isQueryValid } = useWebsiteQueryBuilder({
    beaconType: beaconTypeField?.value,
    websiteId: entityId
  });

  const isFilterExpressionValid = useValidateWebsiteFilterExpression({
    filterExpression: filterExpressionField?.value,
    isQueryValid
  });

  useSetFormFooterEffect({
    formId: 'createApdexForm',
    cloneOnly: isEditing,
    isSaving,
    onCancel,
    setFooter
  });

  const handleSubmit = (form: Item) => {
    if (!isFilterExpressionValid) return;

    onSubmit(form);
  };

  // eslint-disable-next-line import/no-deprecated
  const apdexNameField = getField<string>(form, [apdexNameKey]);
  // eslint-disable-next-line import/no-deprecated
  const thresholdField = getField<number>(form, [apdexEntityKey, thresholdKey]);
  const apdexName = apdexNameField?.value;
  const threshold = thresholdField?.value;

  return (
    <Form form={form} setForm={f => onChange([], () => f)} onSubmit={handleSubmit} formId="createApdexForm">
      <Stack gap="large">
        {isEditing && <EditConfigNotice />}
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
          beaconOptions={enabledApdexBeaconTypes}
          QueryBuilder={QueryBuilder}
          tagFilterExpressionField={filterExpressionField}
          beaconTypeField={beaconTypeField}
          onChangeBeaconType={newBeaconType =>
            onChange([apdexEntityKey, beaconTypeKey], item => setFieldValue(item, newBeaconType, true))
          }
          onChangeTagFilterExpression={newFilterExpression =>
            onChange([apdexEntityKey, tagFilterExpressionKey], item => setFieldValue(item, newFilterExpression, true))
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
                additionalContent={<TouchedMessages field={thresholdField} />}
              />
              <ApdexConfigPreview
                apdexEntity={
                  isFilterExpressionValid && thresholdField?.valid
                    ? toApdexConfigurationInput(form).apdexEntity
                    : undefined
                }
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
