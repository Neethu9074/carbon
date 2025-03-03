/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonCheckbox, CarbonForm, CarbonStack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/ConfigureIdPInfoMessage';

interface DeleteConfigurationViewProps {
  isDeleteEnabled: boolean;
  setIsDeleteEnabled: (isDeleteEnabled: boolean) => void;
}

const DeleteConfigurationView = (props: DeleteConfigurationViewProps) => {
  const { isDeleteEnabled, setIsDeleteEnabled } = props;
  return (
    <CarbonForm>
      <CarbonStack gap={3}>
        <Typography variant="heading-02">
          {t('in-settings:tabs.authenticationProviders.deleteActiveConfiguration')}
        </Typography>
        <ConfigureIdPInfoMessage />
        <Typography variant="body-01">
          {t('in-settings:tabs.authenticationProviders.administratorsWillBeAbletoLogin')}
        </Typography>
        <CarbonCheckbox
          labelText={t('in-settings:tabs.authenticationProviders.actionCannotBeUndone')}
          id="deleteConfigEnable"
          checked={isDeleteEnabled}
          onChange={({ target }) => setIsDeleteEnabled(target.checked)}
        />
      </CarbonStack>
    </CarbonForm>
  );
};

export default DeleteConfigurationView;
