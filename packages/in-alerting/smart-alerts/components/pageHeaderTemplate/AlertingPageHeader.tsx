/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Message, MessageTypes } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from 'in-alerting/smart-alerts/components/pageHeaderTemplate/AlertingPageHeader.mless';

export default function AlertingPageHeader({ title, messageData }: { title: string; messageData?: EnrichedError }) {
  return (
    <div className={locals.spaceBetween}>
      <div className={locals.iconTitle}>
        <SvgIcon className={locals.icon} type="lib_alerts_create" color={themes.default.ids.color.option.black} />
        <AlertTypography variant="heading-300" color="color900" content={title} />
      </div>
      {messageData?.message && (
        <Message
          type={messageData?.level as MessageTypes}
          fullInlineWidth
          withIcon
          className={locals.message}
          title={messageData?.message as string}
        />
      )}
    </div>
  );
}
