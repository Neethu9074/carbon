/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { CarbonCheckbox, CarbonForm, CarbonStack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/ConfigureIdPInfoMessage';

interface DeleteConfigurationViewProps {
  form: MapForm<any>;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any>>>;
}

const DeleteConfigurationView = (props: DeleteConfigurationViewProps) => {
  const { form, setForm } = props;
  const isEnabledField = form.get('isDeleteEnabled');

  return (
    <CarbonForm>
      <CarbonStack gap={3}>
        <Typography variant="heading-02">
          {t('in-settings:tabs.authenticationProviders.deleteActiveConfiguration')}
        </Typography>
        <ConfigureIdPInfoMessage />
        <Typography variant="body-01">
          {t('in-settings:tabs.authenticationProviders.everyUserWillBeAbletoLogin')}
        </Typography>
        <CarbonCheckbox
          labelText={t('in-settings:tabs.authenticationProviders.actionCannotBeUndone')}
          id="deleteConfigEnable"
          invalid={!isEnabledField.valid && isEnabledField.touched}
          invalidText={isEnabledField.messages[0]?.message}
          checked={isEnabledField.value}
          onChange={({ target }) =>
            setForm(form.updateIn(['isDeleteEnabled'], f => f.setValue(target.checked).setTouched(true)))
          }
        />
      </CarbonStack>
    </CarbonForm>
  );
};

export default DeleteConfigurationView;
