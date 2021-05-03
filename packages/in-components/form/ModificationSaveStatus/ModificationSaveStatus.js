/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useReducer } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import './ModificationSaveStatus.less';

export default function ModificationSaveStatus(props) {
  // just a field to be filled to force a rerender
  // eslint-disable-next-line no-unused-vars
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  let timeout;
  const block = 'in-save-status';
  const showModificationStatusForMillis = 3000;

  useEffect(() => {
    return () => {
      disposeCurrentTimeout();
    };
  }, []);

  useEffect(() => {
    startTimeoutForStatusRemoval(props);
  }, [props.status]);

  const startTimeoutForStatusRemoval = ({ status }) => {
    disposeCurrentTimeout();

    if (!status) {
      return;
    }

    timeout = setTimeout(setDummyValue, showModificationStatusForMillis);
  };

  const setDummyValue = () => {
    forceUpdate();
  };

  const disposeCurrentTimeout = () => {
    clearTimeout(timeout);
  };

  const { status } = props;
  if (!status || Date.now() >= status.time + showModificationStatusForMillis) {
    if (props.reserveSpace) {
      return <span className={classNames(props.className, `${block}__space-blocker`)} style={{ width: '16px' }} />;
    }
    return null;
  }

  let iconType;
  let className = classNames(props.className, block);
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

ModificationSaveStatus.propTypes = {
  className: rpt.string,
  status: rpt.shape({
    state: rpt.oneOf(['success', 'failure', 'loading']).isRequired,
    time: rpt.number.isRequired,
    message: rpt.string
  }),
  reserveSpace: rpt.bool
};
