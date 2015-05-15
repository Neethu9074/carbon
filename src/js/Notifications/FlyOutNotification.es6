'use strict';

import './FlyOutNotification.less';

import React from 'react/addons';
import classnames from 'instana-ui-services/util/classnames';
import {health} from 'instana-ui-sdk/health';
import Icon from 'instana-ui-components/Icon';

const blockIdentifier = 'in-fly-out-notification';

const FlyOutNotification = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className={blockIdentifier}
           onClick={this.props.onClick}
           ref='element'>
        {this.getIcon()}
        <div className={blockIdentifier + '__content'}>
          <h1 className={blockIdentifier + '__heading'}>
            {this.props.notification.getIn(['data', 'title'])}
          </h1>
          <p className={blockIdentifier + '__message'}>
            {this.props.notification.getIn(['data', 'message'])}
          </p>
        </div>
      </div>
    );
  },

  getIcon() {
    const severity = this.props.notification.getIn(['data', 'severity']);
    const classes = this.getClassIdentifierWithSeverity(
      blockIdentifier + '__icon'
    );

    let label;
    let icon;
    if (severity === health.warning) {
      label = 'Warning';
      icon = 'bell-o';
    } else if (severity === health.danger) {
      label = 'Danger';
      icon = 'exclamation-triangle';
    } else {
      label = 'Message';
      icon = 'bullhorn';
    }

    return (
      <div className={classes}>
        <Icon type={icon}/>
        {label}
      </div>
    );
  },

  getClassIdentifierWithSeverity(identifier) {
    const severity = this.props.notification.getIn(['data', 'severity']);
    return classnames({
      [identifier]: true,
      [identifier + '--warning']: severity === health.warning,
      [identifier + '--danger']: severity === health.danger,
      [identifier + '--ok']: severity === health.ok
    });
  },

  componentDidMount() {
    const element = React.findDOMNode(this.refs.element);
    element.style.height = getComputedStyle(element).height;
  }
});

export default FlyOutNotification;
