/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './ExpandButton.mless';

export default connectTo(
  props => ({
    isLoading: props.events$.on(`isLoadingData_${props.direction}`).distinct(),
    isExpanded: props.events$.on(`isExpanded_${props.direction}`).distinct(),
    errors: props.events$.on(`errors_${props.direction}`).distinct()
  }),
  function ExpandButton({ className, isLoading, isExpanded, errors, onClick, direction }) {
    if (isExpanded) {
      return null;
    }
    const hasErrors = errors && errors.length > 0;
    const content = (
      <div
        className={classNames({
          [locals.expandButtonRight]: direction === 'outgoing',
          [locals.expandButtonLeft]: direction === 'incoming',
          [locals.errorneousExpandIcon]: errors && errors.length > 0,
          [className]: className
        })}
        onClick={onClick}
      >
        <SvgIcon
          className={locals.expandIcon}
          type={isLoading ? 'lib_actions_loading' : 'lib_openclose_add'}
          spinning={isLoading}
        />
      </div>
    );

    if (hasErrors) {
      return <Tooltip content={<ErroneousResultPresenter errors={errors} />}>{content}</Tooltip>;
    }
    return content;
  }
);
