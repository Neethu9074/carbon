import React from 'react';

import HorizontalFormGroup from 'in-components/form/HorizontalFormGroup/HorizontalFormGroup';
import { joinClassNames } from 'in-services/util/classnames';

import './HorizontalFormGroupWithBackground.less';

const block = 'in-config-view-hori-form-group';

export default function HorizontalFormGroupWithBackground({ children, className }) {
  return (
    <HorizontalFormGroup className={joinClassNames(className, block)}>
      {children}
    </HorizontalFormGroup>
  );
}
