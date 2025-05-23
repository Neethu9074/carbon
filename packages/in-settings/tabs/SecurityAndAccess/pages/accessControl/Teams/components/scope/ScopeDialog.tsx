/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { stringify } from 'qs';
import { omit } from 'lodash';

import { Modal } from '@instana/carbon';
import { Team } from '@instana/types';

import {
  createScopeForm,
  SCOPE_FORM_ID
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { createNavItems } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.navItems';
import MapFormProvider, { FormMode } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { close as closeModal } from 'in-components/DialogPresenter/store';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useDerivedState from 'in-hooks/useDerivedState';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

interface ScopeDialogProps {
  mode: FormMode;
  team: Team;
  refreshTeam: (data: Team) => void;
  saveTeam: (data: Team, onSuccess: (data: Team) => void, onError: (message: string) => void) => void;
}

const ScopeDialog = ({ mode, team, refreshTeam, saveTeam }: ScopeDialogProps) => {
  const [form, setForm] = useDerivedState(createScopeForm(team.scope));
  const [status, setStatus] = useState('');
  const timeConfig = useTimeConfig();
  const navigationItems = createNavItems(form, timeConfig);

  function onSubmit() {
    if (!form.hierarchyValid) {
      // In case user clicks on save button and the form is in invalid state we
      // cancel the submission request and set the form to touched in order to
      // show validation messages to the user.
      return setForm(form.setTouched(true));
    }

    setStatus('pending');

    const newScope = form.toJS();

    // Transform action types and action tags into single action filter string
    const actionFilter = stringify(
      { tags: newScope.actionTags, type: newScope.actionTypes },
      { encode: false, arrayFormat: 'comma' }
    );

    const payload = {
      ...team,
      scope: {
        ...omit(newScope, 'actionTags', 'actionTypes'),
        actionFilters: [actionFilter],
        ...form.get('infrastructureForm').toJS()
      }
    };

    saveTeam(
      payload,
      data => {
        setStatus('success');
        addMessage({
          type: 'success',
          content: t('in-settings:dialogs.scope.scopeSuccessfullySaved'),
          timeout: seconds.toMillis(4)
        });
        refreshTeam(data);
        closeModal();
      },
      () => {
        setStatus('error');
        addMessage({
          type: 'danger',
          content: t('in-components:error.serverErrorInfo'),
          timeout: seconds.toMillis(6)
        });
      }
    );
  }

  return (
    <MapFormProvider id={SCOPE_FORM_ID} form={form} mode={mode} updateForm={setForm}>
      <Modal
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
          <StepsContainer navItems={navigationItems} noDivider />
        </form>
      </Modal>
    </MapFormProvider>
  );
};

export default ScopeDialog;
