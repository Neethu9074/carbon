/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button } from '@instana/components';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t, Trans } from 'in-i18n';

export function showSuccessMessage(
  name: string,
  editMode = false,
  isGlobalSmartAlert: boolean = false,
  linkHref?: string
) {
  const mode = isGlobalSmartAlert ? 'Global' : 'Local';

  addMessage({
    type: 'info',
    timeout: 10000,
    title: t(
      editMode
        ? 'in-alerting:smartAlerts.components.userInfo.success.edit.alert.title'
        : 'in-alerting:smartAlerts.components.userInfo.success.create.alert.title',
      { context: mode }
    ),
    content: (
      <div>
        <p>
          <Trans
            i18nKey={
              editMode
                ? 'in-alerting:smartAlerts.components.userInfo.success.edit.alert.message'
                : 'in-alerting:smartAlerts.components.userInfo.success.create.alert.message'
            }
            values={{
              context: mode,
              name: name
            }}
          />
        </p>

        {linkHref && (
          <Button kind="action" href={linkHref}>
            {t('in-alerting:smartAlerts.components.userInfo.linkText')}
          </Button>
        )}
      </div>
    )
  });
}
