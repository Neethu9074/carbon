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
    const { children, className, dismissible } = this.props;
    const { dismiss } = this.state;

    if (dismiss) {
      return null;
    }

    return (
      <div className={joinClassNames(locals.message, className)}>
        <div className={locals.content}>{children}</div>
        {dismissible && <SvgIcon type="x" width={12} className={locals.dismiss} onClick={() => this.onDismiss()} />}
      </div>
    );
  }

  onDismiss() {
    this.setState({ dismiss: true });
  }
}
