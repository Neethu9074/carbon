/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Stack, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { setTimeConfig, urlQueryKeys } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import TimeCount from 'in-components/time/TimeCount';
import { t, Trans } from 'in-i18n';

import locals from './ReleaseOccuredMessage.mless';

export default function ReleaseOccurredMessage({ release }) {
  const windowSize = useObservable(
    navigationParameters$.map(location => get(location, ['query', urlQueryKeys.windowSize], null)).distinct(),
    []
  );

  return (
    <div className={locals.container}>
      <h1 className={locals.title}>{t('in-events:titleReleaseOccurred')}</h1>
      <div className={locals.content}>
        <p>{t('in-events:releaseOccurName', { releaseName: release.name })}</p>
        <p>
          <Trans
            i18nKey="in-events:releaseOccurTime"
            values={{ releaseStartTime: formatDateTime(release.start) }}
            components={{ timeCount: <TimeCount start={release.start} /> }}
          />
        </p>
      </div>
      <Stack direction="horizontal" gap="disabled" wrap>
        <Button
          className={locals.btnLeft}
          href$={getModifiedUrlStream(params => {
            const to = release.start + windowSize / 2;
            setTimeConfig(params, { to, windowSize });
          })}
          kind="action"
          onClick={() => removeMessage(release.id)}
        >
          {t('in-events:buttonFocusTimeToRelease')}
        </Button>
        <Button
          href$={getModifiedUrlStream(params => {
            setTimeConfig(params, { autoRefresh: true });
          })}
          kind="action"
          onClick={() => removeMessage(release.id)}
        >
          {t('in-events:buttonFollowReleaseLive')}
        </Button>
      </Stack>
    </div>
  );
}
