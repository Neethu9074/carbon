/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HorizontalFormGroup.mless';

export default function HorizontalFormGroupWithBackground({
  children,
  className,
  helpText,
  isWarning,
  noHelpTextSpacer,
  withoutBottomBorder
}) {
  const helpTextSpacer = !helpText && !noHelpTextSpacer ? <div className={locals.helpIconSpacer} /> : null;
  return (
    <div
      className={classNames({
        [locals.helpTextWrapper]: true,
        [locals.withoutBottomBorder]: withoutBottomBorder
      })}
    >
      {helpText ? (
        <Tooltip content={helpText} align="rightMiddle">
          <SvgIcon type="lib_help_error_info_outline" size="s" color={isWarning ? '#64aade' : '#172429'} />
        </Tooltip>
      ) : (
        helpTextSpacer
      )}
      <div className={classNames(className, locals.group)}>{children}</div>
    </div>
  );
}
