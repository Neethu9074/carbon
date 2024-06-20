/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Stack, Checkbox } from '@instana/components';

import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-components/time/timeframeFormatter';
import { useShortUrl } from 'in-components/DashboardHeader/UrlShortener/shortener';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { timeConfig$, fixateTimeConfig } from 'in-stores/time/config';
import InlineTabNavigation from 'in-components/InlineTabNavigation';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './UrlShortenerOverlay.mless';

const tabList = [
  {
    icon: 'lib_actions_interface_link',
    text: t('in-components:dashboardHeader.urlShortenerTabListTextShortLink'),
    key: 'shortlink'
  }
];

export default function UrlShortenerOverlay() {
  const [fixateTime, setFixateTime] = useState(true);
  const getShortUrl = useShortUrl();
  const result = useObservable(() => getShortUrl({ fixateTime }), [fixateTime]);

  // NOTE: this specifically needs to grab the user selected timeConfig from in-stores/time/config
  // instead of the default useTimeConfig, because the analyze view employs a fixed timeConfig context,
  // but needs to still show the original user selection
  const timeConfig = useObservable(timeConfig$, []);
  const shortUrl = result?.data?.shortUrl;

  return (
    <div className={locals.wrapper}>
      <InlineTabNavigation
        tabList={tabList}
        // Deliberately do not show active style by setting activeTabIndex to a tab index that doesn't exist
        activeTabIndex={1}
      />
      {!shortUrl && <Wait />}
      {shortUrl && (
        <Ready shortUrl={shortUrl} fixateTime={fixateTime} setFixateTime={setFixateTime} timeConfig={timeConfig} />
      )}
    </div>
  );
}

function Wait() {
  return (
    <LoadingIndicator
      width={300}
      height={100}
      text={t('in-components:dashboardHeader.urlShortenerWaitTextGeneratingShortLink')}
    />
  );
}

function Ready({ shortUrl, setFixateTime, fixateTime, timeConfig }) {
  return (
    <div className={locals.ready}>
      <Stack gap="small">
        <div className={locals.copyRow}>
          <Input
            type="text"
            value={shortUrl}
            readOnly
            className={locals.input}
            onMouseUp={e => {
              e.preventDefault();
              e.target.select();
            }}
          />
          <CopyToClipboardButton kind="create" getText={() => shortUrl} className={locals.copy}>
            {t('in-components:dashboardHeader.copy')}
          </CopyToClipboardButton>
        </div>

        {timeConfig?.to == null && (
          <Checkbox
            label={t('in-components:dashboardHeader.urlShortenerLabelLockCurrentTimeRange')}
            explanation={<Explanation timeConfig={timeConfig} fixateTime={fixateTime} />}
            size="larger"
            checked={fixateTime}
            onChange={e => setFixateTime(e.target.checked)}
          />
        )}
      </Stack>
    </div>
  );
}

function Explanation({ timeConfig, fixateTime }) {
  const timeZone = new Date().toLocaleDateString('default', { day: '2-digit', timeZoneName: 'short' }).slice(4);

  if (fixateTime) {
    timeConfig = fixateTimeConfig(timeConfig);
  }

  return (
    <div className={locals.explanation}>
      {timeDisplayTopFormat(timeConfig)}

      <span className={locals.bottomTimeRow}>
        {timeConfig.autoRefresh
          ? t('in-components:dashboardHeader.urlShortenerLabelLive', {
              timeConfig: timeDisplayBottomFormat(timeConfig)
            })
          : timeDisplayBottomFormat(timeConfig)}{' '}
        {timeZone}
      </span>
    </div>
  );
}
