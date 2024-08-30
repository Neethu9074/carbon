/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Link } from '@instana/components';

import { removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { formatDateTime } from 'in-services/formatters/date';
import { setTimeConfig } from 'in-stores/time/config';
import TimeCount from 'in-components/time/TimeCount';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t, Trans } from 'in-i18n';

import locals from './ReleaseOccuredMessage.mless';

export default function ReleaseOccurredMessage({ release }) {
  return (
    <div>
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
      <div className={locals.controls}>
        <Stack direction="vertical" wrap>
          <FocusTimeToReleaseButton release={release} />
          <FollowReleaseLiveButton release={release} />
        </Stack>
      </div>
    </div>
  );
}

function FocusTimeToReleaseButton({ release }) {
  const { windowSize } = useTimeConfig();
  const { location, createHref } = useNavigation();
  const to = release.start + windowSize / 2;
  setTimeConfig(location, { to, windowSize });

  return (
    <Link
      href={createHref(location)}
      onClick={() => {
        removeMessage(release.id);
      }}
    >
      {t('in-events:buttonFocusTimeToRelease')}
    </Link>
  );
}

function FollowReleaseLiveButton({ release }) {
  const { location, createHref } = useNavigation();
  setTimeConfig(location, { autoRefresh: true });

  return (
    <Link href={createHref(location)} onClick={() => removeMessage(release.id)}>
      {t('in-events:buttonFollowReleaseLive')}
    </Link>
  );
}
