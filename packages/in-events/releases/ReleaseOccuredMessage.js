/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import { removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { setTimeConfig, urlQueryKeys } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import TimeCount from 'in-new-components/time/TimeCount';
import Button from 'in-new-components/Button/Button';
import useObservable from 'in-hooks/useObservable';

import locals from './ReleaseOccuredMessage.mless';

export default function ReleaseOccurredMessage({ release }) {
  const windowSize = useObservable(
    navigationParameters$.map(location => get(location, ['query', urlQueryKeys.windowSize], null)).distinct(),
    []
  );

  return (
    <div className={locals.container}>
      <h1 className={locals.title}>A release has occurred recently</h1>
      <div className={locals.content}>
        <p>Release: {release.name}</p>
        <p>
          {formatDateTime(release.start)} (<TimeCount start={release.start} /> ago)
        </p>
      </div>
      <nav className={locals.controls}>
        <Button
          className={locals.btnLeft}
          href$={getModifiedUrlStream(params => {
            const to = release.start + windowSize / 2;
            setTimeConfig(params, { to, windowSize });
          })}
          kind="action"
          onClick={() => removeMessage(release.id)}
        >
          Focus time to release
        </Button>
        <Button
          href$={getModifiedUrlStream(params => {
            setTimeConfig(params, { autoRefresh: true });
          })}
          kind="action"
          onClick={() => removeMessage(release.id)}
        >
          Follow releases live
        </Button>
      </nav>
    </div>
  );
}
