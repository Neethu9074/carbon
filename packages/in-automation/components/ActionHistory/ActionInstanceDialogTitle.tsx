/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { Title } from 'in-components/Dialog/Header';
import { t } from 'in-i18n';

import locals from './ActionInstanceDetail.mless';

export function ActionInstanceDialogTitle({ title, status }: { title: string; status: string }) {
  return (
    <HorizontalFlexWrapper className={locals.titleWrapper}>
      <Title title={title} />
      {status ? <div>{getStatus(status)}</div> : <span>{t('in-automation:actionHistory.unknown')}</span>}
    </HorizontalFlexWrapper>
  );
}
