/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './MapNoContentMessage.less';

const block = 'in-map-no-content-msg';

export default connectTo(
  {
    timeConfig: timeConfig$,
    query: query$
  },
  class extends React.Component {
    static displayName = 'Message';

    state = {
      isContentAvailable: true
    };

    UNSAFE_componentWillMount() {
      this.subscription = searchMatches$
        .debounce(500)
        .map(searchMatches => {
          const isContentAvailable = !searchMatches || (searchMatches && searchMatches.size > 0) ? true : false;
          return isContentAvailable;
        })
        .distinct()
        .subscribe(isContentAvailable => this.setState({ isContentAvailable }));
    }

    componentWillUnmount() {
      removeMessage('mapNoContent');

      this.subscription.dispose();
      this.subscription = null;
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
      let message;
      if (nextProps.timeConfig.focusedMoment) {
        message = t('in-map:noDataFoundForTheQueryAtTheSelectedMoment', {
          nextPropsQuery: nextProps.query,
          time: formatDateTime(nextProps.timeConfig.focusedMoment)
        });
      } else {
        message = t('in-map:noDataFoundForTheQuery', {
          nextPropsQuery: nextProps.query
        });
      }

      if (!nextState.isContentAvailable && nextProps.query.length > 0) {
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
    }

    render() {
      return null;
    }
  }
);
