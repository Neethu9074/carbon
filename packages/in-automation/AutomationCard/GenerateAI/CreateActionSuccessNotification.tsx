/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import useHrefToActionDashboard from 'in-automation/navigation/hooks/useHrefToActionDashboard';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { Trans, t } from 'in-i18n';

function ActionSuccess({ name, id }: { name: string; id: string }) {
  const hrefToActionDashboard = useHrefToActionDashboard();
  return (
    <Trans
      i18nKey={'in-automation:GenerateAIActionDialog.action.success.content'}
      values={{
        name
      }}
      components={{
        // @ts-expect-error
        Link: <Link external href={hrefToActionDashboard(id)} />
      }}
    />
  );
}

export function createActionSuccessNotification(name: string, id: string) {
  addMessage({
    type: 'info',
    timeout: 5000,
    title: t('in-automation:GenerateAIActionDialog.action.success.title'),
    content: <ActionSuccess name={name} id={id} />
  });
}
