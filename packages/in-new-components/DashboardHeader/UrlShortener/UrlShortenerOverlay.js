/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import React from 'react';

import { timeDisplayTopFormat, timeDisplayBottomFormat } from 'in-new-components/time/timeframeFormatter';
import { getShortUrl } from 'in-new-components/DashboardHeader/UrlShortener/shortener';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import { timeConfig$, fixateTimeConfig } from 'in-stores/time/config';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Stack from 'in-components/layout/Stack';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './UrlShortenerOverlay.mless';

const tabList = [
  {
    icon: 'lib_actions_interface_link',
    text: t('in-new-components:dashboardHeader.urlShortenerTabListTextShortLink'),
    key: 'shortlink'
  }
];

export default compose(
  withState('fixateTime', 'setFixateTime', true),
  connectTo(({ fixateTime }) => ({
    result: getShortUrl({ fixateTime }),
    timeConfig: timeConfig$
  }))
)(UrlShortenerOverlay);

function UrlShortenerOverlay({ result, fixateTime, setFixateTime, timeConfig }) {
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
      text={t('in-new-components:dashboardHeader.urlShortenerWaitTextGeneratingShortLink')}
    />
  );
}

function Ready({ shortUrl, setFixateTime, fixateTime, timeConfig }) {
  return (
    <div className={locals.ready}>
      <Stack space="small">
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
            {t('in-new-components:dashboardHeader.copy')}
          </CopyToClipboardButton>
        </div>

        {timeConfig?.to == null && (
          <CheckboxFancy
            label={t('in-new-components:dashboardHeader.urlShortenerLabelLockCurrentTimeRange')}
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
  if (fixateTime) {
    timeConfig = fixateTimeConfig(timeConfig);
  }

  return (
    <div className={locals.explanation}>
      {timeDisplayTopFormat(timeConfig)}

      <span className={locals.bottomTimeRow}>
        {timeConfig.autoRefresh
          ? t('in-new-components:dashboardHeader.urlShortenerLabelLive', {
              timeConfig: timeDisplayBottomFormat(timeConfig)
            })
          : timeDisplayBottomFormat(timeConfig)}
      </span>
    </div>
  );
}
