/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import SloNameAndTagsSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloNameAndTagsSection/SloNameAndTagsSection';
import SloBlueprintsSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloBlueprintsSection/SloBlueprintsSection';
import SloObjectiveSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloObjectiveSection/SloObjectiveSection';
import SloEntitySection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntitySection';
import SloScopeSection from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/SloScopeSection';
import SloFormPreview from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/SloFormPreview';
import { formToSloConfiguration, isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import getTranslatedErrorMessage from 'in-service-levels/components/ConfigDialog/errors';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import useSloFormSideEffects from 'in-service-levels/hooks/useSloFormSideEffects';
import { createSloConfiguration } from 'in-service-levels/api/configuration';
import useFormSubmission from 'in-service-levels/hooks/useFormSubmission';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ConfigDialog from 'in-service-levels/components/ConfigDialog';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { close } from 'in-components/DialogPresenter/store';
import { NavItem } from 'in-components/SideNav/SideNav';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

export default function CreateSloDialog() {
  const [form, setForm] = useState(createSloForm({ entityType: 'application' }));
  const updateForm = useSloFormSideEffects(form, setForm as (f: Item) => void);
  const [, doSubmit] = useFormSubmission(createSloConfiguration);

  const nameField = form.getIn(['nameTags', 'name']);
  const targetField = form.getIn(['objective', 'target']);
  const thresholdField = form.getIn(['indicator', 'threshold']);
  const dateField = form.getIn(['objective', 'startTimestamp', 'date']);
  const timeField = form.getIn(['objective', 'startTimestamp', 'time']);

  const isNameValid = isFieldValid(nameField);
  const isTargetFieldValid = isFieldValid(targetField);
  const isThresholdValid = isFieldValid(thresholdField);
  const isDateFieldValid = isFieldValid(dateField);
  const isTimeFieldValid = isFieldValid(timeField);

  const navItems: Array<NavItem> = [
    {
      content: <SloEntitySection />,
      label: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      scrollId: '1-select-entity',
      title: t('in-service-levels:createSloDialog.selectEntityNavItem'),
      valid: true
    },
    {
      content: <SloScopeSection />,
      label: t('in-service-levels:createSloDialog.selectScopeNavItem'),
      scrollId: '2-select-scope',
      title: t('in-service-levels:createSloDialog.selectScopeNavItem'),
      valid: true
    },
    {
      content: <SloBlueprintsSection />,
      label: t('in-service-levels:createSloDialog.selectIndicator'),
      scrollId: '3-select-indicator',
      title: t('in-service-levels:createSloDialog.selectIndicator'),
      valid: isThresholdValid
    },
    {
      content: <SloObjectiveSection />,
      label: t('in-service-levels:createSloDialog.selectObjectiveNavItem'),
      scrollId: '3-select-objective',
      title: t('in-service-levels:createSloDialog.selectObjectiveNavItem'),
      valid: isTargetFieldValid && isDateFieldValid && isTimeFieldValid
    },
    {
      content: <SloNameAndTagsSection />,
      label: t('in-service-levels:createSloDialog.nameAndTagsNavItem'),
      scrollId: '4-name-and-tags',
      title: t('in-service-levels:createSloDialog.nameAndTagsNavItem'),
      valid: isNameValid
    },
    {
      content: <SloFormPreview updateForm={updateForm} />,
      label: t('in-service-levels:general.preview'),
      scrollId: '6-preview',
      title: t('in-service-levels:general.preview'),
      valid: true
    }
  ];

  return (
    <SloFormContext.Provider value={{ form, onChange: (path, fn) => updateForm(form.updateIn(path, fn)) }}>
      <ConfigDialogTimeConfigContextModification>
        <ConfigDialog
          title={t('in-service-levels:createSloDialog.title')}
          navItems={navItems}
          onClose={close}
          noHeader
          noDivider
          onSave={() => {
            updateForm(form.setTouched(true, { recurse: true }));

            if (!form.hierarchyValid) return;

            doSubmit({
              payload: formToSloConfiguration(form),
              onSuccess,
              onError
            });
          }}
        />
      </ConfigDialogTimeConfigContextModification>
    </SloFormContext.Provider>
  );
}

function onSuccess({ data }: Result<ServiceLevelObjectiveConfiguration>) {
  if (!data) throw Error(ServiceLevelErrors.UNEXPECTED_SLO_CREATION_ERROR);

  const { name } = data;

  addMessage({
    type: 'info',
    timeout: seconds.toMillis(4),
    title: t('in-service-levels:createSloDialog.messages.creationSuccessfulTitle'),
    content: t('in-service-levels:createSloDialog.messages.creationSuccessfulContent', {
      name
    })
  });
}

const errorMessageHeader = {
  type: 'danger',
  title: t('in-service-levels:createSloDialog.messages.creationFailedTitle')
} as const;

function onError(result?: Result<ServiceLevelObjectiveConfiguration>) {
  if (result && result.errors.length !== 0) {
    return result.errors.forEach(error =>
      addMessage({
        ...errorMessageHeader,
        timeout: seconds.toMillis(6),
        content: getTranslatedErrorMessage(error)
      })
    );
  }

  if (!result?.data) {
    return addMessage({
      ...errorMessageHeader,
      timeout: seconds.toMillis(6),
      content: t('in-service-levels:createSloDialog.messages.creationFailedUnexpectedContent')
    });
  }

  const { name } = result.data;

  return addMessage({
    ...errorMessageHeader,
    timeout: seconds.toMillis(6),
    content: t('in-service-levels:createSloDialog.messages.creationFailedContent', {
      name
    })
  });
}
