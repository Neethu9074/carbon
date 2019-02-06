import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HorizontalFormGroup.mless';

export default function HorizontalFormGroupWithBackground({
  children,
  className,
  helpText,
  isWarning,
  noHelpTextSpacer
}) {
  const helpTextSpacer = !helpText && !noHelpTextSpacer ? <div className={locals.helpIconSpacer} /> : null;
  return (
    <div className={locals.helpTextWrapper}>
      {helpText ? (
        <Tooltip content={helpText} align="rightMiddle">
          <SvgIcon type="info" width={16} height={16} color={isWarning ? '#64aade' : '#172429'} />
        </Tooltip>
      ) : (
        helpTextSpacer
      )}
      <div className={joinClassNames(className, locals.group)}>{children}</div>
    </div>
  );
}
