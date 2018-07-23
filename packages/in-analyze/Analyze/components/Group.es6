import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Group.mless';

export default function Group({ name, onClick, onRemove }) {
  return (
    <div className={locals.groupWrapper}>
      <div className={locals.group} onClick={onClick}>
        <span className={locals.name}>{name}</span>
      </div>

      <SvgIcon className={locals.removeIcon} type="lib_openclose_cancel" width={24} height={24} onClick={onRemove} />
    </div>
  );
}
