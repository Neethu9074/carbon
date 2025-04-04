/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonModal } from '@instana/components';

import {
  SCOPE_FORM_ACTIONS,
  SCOPE_FORM_ID,
  SCOPE_NAV_ITEMS
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.constants';
import {
  createRoleForm,
  DefaultRoleFormFieldValues
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/roleForm';
import MapFormProvider, { FormMode } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { close as closeModal } from 'in-components/DialogPresenter/store';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useFormSubmission from 'in-hooks/useFormSubmission';
import useDerivedState from 'in-hooks/useDerivedState';
import { t } from 'in-i18n';

interface ScopeDialogProps {
  mode: FormMode;
  formValues?: DefaultRoleFormFieldValues;
}

export default function ScopeDialog({ mode, formValues }: ScopeDialogProps) {
  const [form, setForm] = useDerivedState(createRoleForm(formValues));
  //@ts-expect-error actions not defined yet
  const [status, submitForm] = useFormSubmission(SCOPE_FORM_ACTIONS[mode]);

  function onSubmit() {
    if (!form.hierarchyValid) {
      // In case user clicks on save button and the form is in invalid state we
      // cancel the submission request and set the form to touched in order to
      // show validation messages to the user.
      return setForm(form.setTouched(true));
    }

    const payload = form.toJS();

    submitForm({
      payload,
      onError: () => {
        addMessage({
          type: 'danger',
          content: t('in-components:error.serverErrorInfo')
        });
      },
      onSuccess: () => {
        addMessage({
          type: 'success',
          content: t('in-settings:dialogs.scope.scopeSuccessfullySaved')
        });
        closeModal();
      }
    });
  }

  return (
    <MapFormProvider id={SCOPE_FORM_ID} form={form} mode={mode} updateForm={setForm}>
      <CarbonModal
        modalHeading={t('in-settings:dialogs.scope.title', { context: mode })}
        onRequestClose={closeModal}
        onRequestSubmit={onSubmit}
        onSecondarySubmit={closeModal}
        open
        primaryButtonDisabled={status === 'pending'}
        primaryButtonText={t('in-settings:tabs.save')}
        secondaryButtonText={t('in-settings:tabs.cancel')}
        size="lg"
      >
        <form>
          <StepsContainer navItems={SCOPE_NAV_ITEMS} noDivider />
        </form>
      </CarbonModal>
    </MapFormProvider>
  );
}
