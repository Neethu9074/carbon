/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography } from '@instana/components';

import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ConfigurationSummary.mless';

export interface ConfigurationSummaryProps {
  accessLevelMsg?: string;
  rolePermissionMsg?: string;
  noAccess?: boolean;
  noAccessMsg?: string;
}

export const ConfigurationSummary = ({
  accessLevelMsg,
  rolePermissionMsg,
  noAccess,
  noAccessMsg
}: ConfigurationSummaryProps) => {
  return (
    <div>
      <Typography variant="heading-200" component="h2">
        {t('in-settings:permissionScope.configuration_summary')}
      </Typography>

      {noAccess ? (
        <Typography variant="body-regular" component="div">
          {noAccessMsg}
        </Typography>
      ) : (
        <>
          <div className={locals.accessLevel}>
            <Label className={locals.label}>{t('in-settings:permissionScope.access_level')}</Label>
            <Typography variant="body-regular" component="div">
              {accessLevelMsg}
            </Typography>
          </div>

          <div>
            <Label className={locals.label}>{t('in-settings:permissionScope.role_permissions')}</Label>
            <Typography variant="body-regular" component="div">
              {rolePermissionMsg}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};
