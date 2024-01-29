/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { Typography } from '@instana/components';

import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ConfigurationSummary.mless';

export interface ConfigurationSummaryProps {
  accessLevelTitle?: string;
  accessLevelMsg?: string;
  rolePermissionMsg?: string;
  noAccess?: boolean;
  children?: ReactNode;
  noAccessMsg?: string;
}

export const ConfigurationSummary = ({
  accessLevelTitle,
  accessLevelMsg,
  rolePermissionMsg,
  noAccess,
  children,
  noAccessMsg
}: ConfigurationSummaryProps) => {
  return (
    <div>
      <Typography variant="heading-200" component="h2">
        {t('in-settings:permissionScope.permissions')}
      </Typography>
      {noAccess ? (
        <Typography variant="body-regular" component="div">
          {noAccessMsg}
        </Typography>
      ) : (
        <>
          <div className={locals.accessLevel}>
            <Label className={locals.label}>{t('in-settings:permissionScope.access_type')}</Label>
            <Typography variant="body-regular" component="div">
              {rolePermissionMsg}
            </Typography>
          </div>
          {children}
          <div className={locals.accessLevel}>
            <Label className={locals.label}>
              {t('in-settings:permissionScope.selection', { context: accessLevelTitle })}
            </Label>
            <Typography variant="body-regular" component="div">
              {accessLevelMsg}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};
