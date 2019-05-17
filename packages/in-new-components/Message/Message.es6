import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Message.mless';

export default class Message extends React.Component {
  static displayName = 'Message';

  constructor(props) {
    super(props);

    this.state = {
      dismiss: false
    };
  }

  render() {
    const { children, className, dismissible, icon } = this.props;
    const { dismiss } = this.state;

    if (dismiss) {
      return null;
    }

    return (
      <div className={joinClassNames(locals.message, className)}>
        {icon && <span className={locals.icon}>{icon}</span>}
        <span className={locals.content}>{children}</span>
        {dismissible && (
          <span className={locals.dismissContainer}>
            <SvgIcon type="x" width={12} className={locals.dismiss} onClick={this.onDismiss} />
          </span>
        )}
      </div>
    );
  }

  onDismiss() {
    this.setState({ dismiss: true });
  }
}
