'use strict';

import './FlyOutNotification.less';

import React from 'react/addons';
import classnames from 'instana-ui-services/util/classnames';
import {health} from 'instana-ui-sdk/health';

const blockIdentifier = 'in-fly-out-notification';

const FlyOutNotification = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    const severity = this.props.notification.getIn(['data', 'severity']);
    const classes = classnames({
      [blockIdentifier]: true,
      [blockIdentifier + '--warning']: severity === health.warning,
      [blockIdentifier + '--danger']: severity === health.danger,
      [blockIdentifier + '--ok']: severity === health.ok
    });

    return (
      <div className={classes}
           onClick={this.props.onClick}
           ref='element'>
        <h1>
          {this.props.notification.getIn(['data', 'title'])}
        </h1>
      </div>
    );
  },

  componentDidMount() {
    const element = React.findDOMNode(this.refs.element);
    element.style.height = getComputedStyle(element).height;
  }
});

export default FlyOutNotification;
