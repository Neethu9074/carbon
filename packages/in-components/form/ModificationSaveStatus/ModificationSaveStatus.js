/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import rpt from 'prop-types';
import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './ModificationSaveStatus.less';

const block = 'in-save-status';
const showModificationStatusForMillis = 3000;

export default class extends React.Component {
  static displayName = 'ModificationSaveStatus';

  static propTypes = {
    className: rpt.string,
    status: rpt.shape({
      state: rpt.oneOf(['success', 'failure', 'loading']).isRequired,
      time: rpt.number.isRequired,
      message: rpt.string
    }),
    reserveSpace: rpt.bool
  };

  state = {
    // just a field to filled to force a rerender
    time: null
  };

  UNSAFE_componentWillMount() {
    this.startTimeoutForStatusRemoval(this.props);
  }

  startTimeoutForStatusRemoval = ({ status }) => {
    this.disposeCurrentTimeout();

    if (!status) {
      return;
    }

    this.timeout = setTimeout(this.setDummyValue, showModificationStatusForMillis);
  };

  setDummyValue = () => {
    this.setState({ time: Date.now() });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.startTimeoutForStatusRemoval(nextProps);
  }

  componentWillUnmount() {
    this.disposeCurrentTimeout();
  }

  disposeCurrentTimeout = () => {
    clearTimeout(this.timeout);
  };

  render() {
    const { status } = this.props;
    if (!status || Date.now() >= status.time + showModificationStatusForMillis) {
      if (this.props.reserveSpace) {
        return (
          <span className={classNames(this.props.className, `${block}__space-blocker`)} style={{ width: '16px' }} />
        );
      }
      return null;
    }

    let iconType;
    let className = classNames(this.props.className, block);
    const tooltip = status.message;
    let spinning = false;

    if (status.state === 'success') {
      className = `${className} ${block}__success`;
      iconType = 'lib_check';
    } else if (status.state === 'failure') {
      className = `${className} ${block}__failure`;
      iconType = 'lib_openclose_cancel';
    } else if (status.state === 'loading') {
      className = `${className} ${block}__loading`;
      iconType = 'lib_actions_loading';
      spinning = true;
    }

    return (
      <Tooltip content={tooltip}>
        <SvgIcon type={iconType} className={className} size="xs" spinning={spinning} />
      </Tooltip>
    );
  }
}
