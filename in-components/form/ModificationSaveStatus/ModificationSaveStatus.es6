import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './ModificationSaveStatus.less';

const block = 'in-save-status';
const showModificationStatusForMillis = 3000;

export default React.createClass({
  displayName: 'ModificationSaveStatus',

  propTypes: {
    className: React.PropTypes.string,
    status: React.PropTypes.shape({
      success: React.PropTypes.bool.isRequired,
      time: React.PropTypes.number.isRequired,
      failureMessage: React.PropTypes.string
    }),
  },

  getInitialState() {
    return {
      // just a field to filled to force a rerender
      time: null
    };
  },

  componentWillMount() {
    this.startTimeoutForStatusRemoval(this.props);
  },

  startTimeoutForStatusRemoval({status}) {
    this.disposeCurrentTimeout();

    if (!status) {
      return;
    }

    const waitTimeMillis = Math.max(0, status.time - Date.now());
    this.timeout = setTimeout(this.setDummyValue, waitTimeMillis);
  },

  setDummyValue() {
    this.setState({time: Date.now()});
  },

  componentWillReceiveProps(nextProps) {
    this.startTimeoutForStatusRemoval(nextProps);
  },

  componentWillUnmount() {
    this.disposeCurrentTimeout();
  },

  disposeCurrentTimeout() {
    clearTimeout(this.timeout);
  },

  render() {
    const {status} = this.props;
    if (!status || Date.now() >= status.time + showModificationStatusForMillis) {
      return null;
    }

    let iconType;
    let className = joinClassNames(this.props.className, block);
    let tooltip;

    if (status.success) {
      className = `${className} ${block}__success`;
      iconType = 'ok';
      tooltip = 'Change successfully changed';
    } else {
      className = `${className} ${block}__failure`;
      iconType = 'x';
      tooltip = status.failureMessage || 'Failed to save change';
    }

    return (
      <Tooltip content={tooltip}>
        <SvgIcon type={iconType}
                 className={className}
                 width={16} />
      </Tooltip>
    );
  }
});
