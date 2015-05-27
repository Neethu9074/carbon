'use strict';

import './FlyOutNotification.less';

import React from 'react/addons';
import classnames from 'instana-ui-services/util/classnames';
import {getHealth} from 'instana-ui-services/health';
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
            <span className={this.getClassIdentifierWithSeverity(
                  blockIdentifier + '__health'
                )}>
              {this.getHealthLabel() + ': '}
            </span>
            {this.props.notification.getIn(['data', 'problemText'])}
          </h1>
          <p className={blockIdentifier + '__message'}>
            {this.props.notification.getIn(['data', 'fixSuggestion'])}
          </p>
        </div>
      </div>
    );
  },

  getIcon() {
    const classes = this.getClassIdentifierWithSeverity(
      blockIdentifier + '__icon'
    );
    const icon = this.getHealthIconType();
    return <Icon type={icon} className={classes}/>;
  },

  getHealthIconType() {
    switch(getHealth(this.props.notification.getIn(['data', 'severity']))) {
      case health.warning:
        return 'bell-o';
      case health.danger:
        return 'exclamation-triangle';
      default:
        return 'bullhorn';
    }
  },

  getHealthLabel() {
    switch(getHealth(this.props.notification.getIn(['data', 'severity']))) {
      case health.warning:
        return 'Warning';
      case health.danger:
        return 'Danger';
      default:
        return 'Message';
    }
  },

  getClassIdentifierWithSeverity(identifier) {
    const severity = this.props.notification.getIn(['data', 'severity']);
    const snapshotHealth = getHealth(severity);
    return classnames({
      [identifier]: true,
      [identifier + '--warning']: snapshotHealth === health.warning,
      [identifier + '--danger']: snapshotHealth === health.danger,
      [identifier + '--ok']: snapshotHealth === health.ok
    });
  },

  componentDidMount() {
    const element = React.findDOMNode(this.refs.element);
    element.style.height = getComputedStyle(element).height;
  }
});

export default FlyOutNotification;
