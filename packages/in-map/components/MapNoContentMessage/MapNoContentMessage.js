/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { useObservable } from '@instana/hooks';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { query$ } from 'in-stores/search/query';
import { t } from 'in-i18n';

import './MapNoContentMessage.less';

const block = 'in-map-no-content-msg';

export default function MapNoContentMessage() {
  const timeConfig = useTimeConfig();
  const query = useObservable(query$, []);
  const [isContentAvailable, setIsContentAvailable] = useState(true);
  useObservable(
    searchMatches$
      .debounce(500)
      .map(searchMatches => (!searchMatches || (searchMatches && searchMatches.size > 0) ? true : false))
      .distinct()
      .tap(setIsContentAvailable),
    []
  );

  useEffect(() => {
    let message;
    if (timeConfig.focusedMoment) {
      message = t('in-map:noDataFoundForTheQueryAtTheSelectedMoment', {
        nextPropsQuery: query,
        time: formatDateTime(timeConfig.focusedMoment)
      });
    } else {
      message = t('in-map:noDataFoundForTheQuery', {
        nextPropsQuery: query
      });
    }

    if (!isContentAvailable && query.length > 0) {
      addMessage(
        {
          type: 'info',
          title: t('in-map:noDataFound'),
          content: <DangerousHtmlPresenter className={block} html={toHtml(message)} />
        },
        'mapNoContent'
      );
    } else {
      removeMessage('mapNoContent');
    }

    return () => {
      removeMessage('mapNoContent');
    };
  }, [isContentAvailable, timeConfig.focusedMoment, query]);

  return null;
}
