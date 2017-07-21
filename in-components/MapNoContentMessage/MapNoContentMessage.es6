import React from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { formatDateTime } from 'in-services/formatters/date';
import { toHtml } from 'in-services/formatters/markdown';
import { focusedMoment$ } from 'in-stores/timeline';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    focusedMoment: focusedMoment$,
    query: query$
  },
  class extends React.Component {
    static displayName = 'Message';

    state = {
      isContentAvailable: true
    };

    componentWillMount() {
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

    componentWillUpdate(nextProps, nextState) {
      let message = `No data found for the query "*${nextProps.query}*"`;
      if (nextProps.focusedMoment) {
        message += ` at the selected moment: *${formatDateTime(nextProps.focusedMoment)}*.`;
      } else {
        message += `.`;
      }

      if (!nextState.isContentAvailable) {
        addMessage(
          {
            type: 'info',
            title: 'No data found',
            content: (
              <div
                dangerouslySetInnerHTML={{
                  __html: toHtml(message)
                }}
              />
            )
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
