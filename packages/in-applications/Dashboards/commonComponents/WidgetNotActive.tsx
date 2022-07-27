/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button, Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { getModifiedUrlStream } from 'in-stores/navigation';
import { urlQueryKeys } from 'in-stores/time/config';

import locals from './WidgetNotActive.mless';

interface WidgetNotActiveProps {
  title: string;
  rightHeaderContent?: React.ReactElement;
}

function getTimeframeNonLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query[urlQueryKeys.autoRefresh] = 'false';
  });
}

export default function WidgetNotActive({ title, rightHeaderContent }: WidgetNotActiveProps) {
  const href$ = getTimeframeNonLiveUrl();

  return (
    <Card title={title} useMaxAvailableHeight size="l" rightHeaderContent={rightHeaderContent}>
      <div className={locals.disabledWidget}>
        <p className={locals.disabledText}>{t('in-applications:widgetNotActive.title')}</p>
        <Button href$={href$}>{t('in-applications:widgetNotActive.button')}</Button>
      </div>
    </Card>
  );
}
