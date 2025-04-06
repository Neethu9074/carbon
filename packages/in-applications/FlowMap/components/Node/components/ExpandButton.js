/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-applications/FlowMap/components/Node/components/ExpandButton.mless';

export default function ExpandButton({ events$, className, onClick, direction }) {
  const isLoading = useObservable(events$.on(`isLoadingData_${direction}`).distinct(), [events$]);
  const isExpanded = useObservable(events$.on(`isExpanded_${direction}`).distinct(), [events$]);
  const errors = useObservable(events$.on(`errors_${direction}`).distinct(), [events$]);

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
