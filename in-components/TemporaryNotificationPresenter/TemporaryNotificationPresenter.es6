import PureRenderMixin from 'react-addons-pure-render-mixin';
import { TransitionMotion, spring } from 'react-motion';
import rpt from 'prop-types';
import React from 'react';

import { temporaryNotification$, clearTemporaryNotification } from 'in-stores/temporaryNotification';
import connectTo from 'in-hoc/connectTo';

import './TemporaryNotificationPresenter.less';

const block = 'in-temporary-notification-presenter';

export default connectTo(
  {
    notification: temporaryNotification$
  },
  React.createClass({
    displayName: 'TemporaryNotificationPresenter',

    mixins: [PureRenderMixin],

    propTypes: {
      notification: rpt.any
    },

    willEnter() {
      return { opacity: 0 };
    },

    willLeave() {
      return { opacity: spring(0) };
    },

    render() {
      const items = [];
      if (this.props.notification) {
        items.push({
          key: 'notification',
          style: { opacity: spring(1) },
          data: this.props.notification
        });
      }

      return (
        <TransitionMotion willLeave={this.willLeave} willEnter={this.willEnter} styles={items}>
          {interpolatedStyles => (
            <div>
              {interpolatedStyles.map(config => {
                return (
                  <div
                    key={config.key}
                    className={block}
                    style={{
                      opacity: config.style.opacity
                    }}
                    onClick={clearTemporaryNotification}
                  >
                    <div className={block + '__content'}>
                      {config.data}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TransitionMotion>
      );
    }
  })
);
