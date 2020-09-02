import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Remove.mless';

export default function Remove({ element, onRemove, nextToBooleanSelector = false }) {
  return (
    <SvgIcon
      className={evaluateClassNames({
        [locals.icon]: true,
        [locals.nextToBooleanSelector]: nextToBooleanSelector
      })}
      type="lib_openclose_cancel"
      onClick={() => onRemove(element.formModelIndex, element.renderModelIndex - 1)}
    />
  );
}
