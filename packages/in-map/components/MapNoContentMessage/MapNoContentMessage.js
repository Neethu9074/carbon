import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import { timeConfig$ } from 'in-stores/time/config';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';

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
      let message = `No data found for the query \`${nextProps.query}\``;
      if (nextProps.timeConfig.focusedMoment) {
        message += ` at the selected moment: *${formatDateTime(nextProps.timeConfig.focusedMoment)}*.`;
      } else {
        message += `.`;
      }

      if (!nextState.isContentAvailable && nextProps.query.length > 0) {
        addMessage(
          {
            type: 'info',
            title: 'No data found',
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
