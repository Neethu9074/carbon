import classNames from 'classnames';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Remove.mless';

export default function Remove({ element, onRemove, nextToBooleanSelector = false }) {
  return (
    <SvgIcon
      className={classNames({
        [locals.icon]: true,
        [locals.nextToBooleanSelector]: nextToBooleanSelector
      })}
      type="lib_openclose_cancel"
      onClick={() => onRemove(element.formModelIndex, element.renderModelIndex - 1)}
    />
  );
}
