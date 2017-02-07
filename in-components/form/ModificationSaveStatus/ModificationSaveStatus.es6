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
      state: React.PropTypes.oneOf(['success', 'failure', 'loading']).isRequired,
      time: React.PropTypes.number.isRequired,
      message: React.PropTypes.string
    }),
    reserveSpace: React.PropTypes.bool
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

    this.timeout = setTimeout(this.setDummyValue, showModificationStatusForMillis);
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
      if (this.props.reserveSpace) {
        return (
          <span className={joinClassNames(this.props.className, `${block}__space-blocker`)}
                style={{width: '16px'}} />
        );
      }
      return null;
    }

    let iconType;
    let className = joinClassNames(this.props.className, block);
    const tooltip = status.message;
    let spinning = false;

    if (status.state === 'success') {
      className = `${className} ${block}__success`;
      iconType = 'ok';
    } else if (status.state === 'failure') {
      className = `${className} ${block}__failure`;
      iconType = 'x';
    } else if (status.state === 'loading') {
      className = `${className} ${block}__loading`;
      iconType = 'spinner';
      spinning = true;
    }

    return (
      <Tooltip content={tooltip}>
        <SvgIcon type={iconType}
                 className={className}
                 width={16}
                 spinning={spinning} />
      </Tooltip>
    );
  }
});
