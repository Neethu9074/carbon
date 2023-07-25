/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message, Typography } from '@instana/components';
import { Link } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { Trans, t } from 'in-i18n';

import locals from './IbmDb2ZNotification.mless';

export default function IbmDb2ZNotification() {
  const supportUrl = 'https://www.ibm.com/docs/en/obiapmoz?topic=configuration-integrating-omegamon';

  return (
    <Message withIcon type="warning" className={locals.notificationMessage}>
      <HorizontalFlexWrapper>
        <div>
          <Typography variant="heading-200">
            {t('in-forge:plugins.db2ZDatabase.notifications.notificationHeader')}
          </Typography>
          <Typography variant="body-regular">
            <Trans
              i18nKey="in-forge:plugins.db2ZDatabase.notifications.notificationText"
              components={{
                supportLink: <Link href={supportUrl} external />
              }}
            />
          </Typography>
        </div>
      </HorizontalFlexWrapper>
    </Message>
  );
}
