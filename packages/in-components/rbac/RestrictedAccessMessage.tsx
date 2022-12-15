/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification';
import { t } from 'in-i18n';

import locals from './RestrictedAccessMessage.mless';

interface RestrictedAccessMessageProps {
  permission?: string;
}

export default function RestrictedAccessMessage({ permission }: RestrictedAccessMessageProps) {
  return (
    <div className={locals.wrapper}>
      <EntityPageMainNotification
        icon="lib_actions_lock"
        title={t('in-components:rbac.restrictedAccess')}
        explanation={() => (
          <Stack direction="vertical" gap="xxsmall" align="center">
            <span>{t('in-components:rbac.restrictedAccessMessagePartOne')}</span>
            {permission ? (
              <span>{t('in-components:rbac.restrictedAccessMessagePartTwoWithPermission', { permission })}</span>
            ) : (
              <span>{t('in-components:rbac.restrictedAccessMessagePartTwo')}</span>
            )}
          </Stack>
        )}
      />
    </div>
  );
}
