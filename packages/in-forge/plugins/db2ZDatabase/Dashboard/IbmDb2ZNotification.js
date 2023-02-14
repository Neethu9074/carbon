/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message, Link } from '@instana/components';

import { Trans, t } from 'in-i18n';

import locals from './IbmDb2ZNotification.mless';

export default function IbmDb2ZNotification() {
  const supportUrl = 'https://www.ibm.com/docs/en/obiapmoz?topic=configuration-integrating-omegamon';

  return (
    <Message withIcon type="warning" className={locals.notificationMessage}>
      <div className={locals.notificationMessageContent}>
        <div>
          <p className={locals.notificationMessageText}>
            <strong>{t('in-forge:plugins.db2ZDatabase.notifications.notificationHeader')}</strong>
          </p>
          <p className={locals.notificationMessageText}>
            <Trans
              i18nKey="in-forge:plugins.db2ZDatabase.notifications.notificationText"
              components={{
                supportLink: <Link href={supportUrl} external />
              }}
            />
          </p>
        </div>
      </div>
    </Message>
  );
}
