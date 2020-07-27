import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Remove.mless';

export default function Remove({ element, onRemove }) {
  return (
    <SvgIcon
      className={locals.icon}
      type="lib_openclose_cancel"
      onClick={() => onRemove(element.formModelIndex, element.renderModelIndex - 1)}
    />
  );
}
