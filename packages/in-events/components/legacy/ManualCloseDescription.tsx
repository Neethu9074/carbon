/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from './ManualCloseDescription.mless';

interface Props {
  event: EventOrMap;
}

export default function ManualCloseDescription({ event }: Props) {
  const metadata = event.get('metadata') as Map<string, any>;
  const reasonForClosing = metadata.get('manualCloseReason');
  const username = metadata.get('manualCloseUsername');

  const htmlManualCloseReason = toHtml(reasonForClosing);
  const htmlManualCloseUsername = toHtml(username);

  return (
    <DescriptionList>
      <DescriptionItem className={locals.title} title={t('in-events:closeEventDialog.closedByLabel')}>
        <DangerousHtmlPresenter className={locals.username} html={htmlManualCloseUsername} />
      </DescriptionItem>
      <DescriptionItem title={t('in-events:closeEventDialog.comments')}>
        <DangerousHtmlPresenter className={locals.reason} html={htmlManualCloseReason} />
      </DescriptionItem>
    </DescriptionList>
  );
}
