import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

export default function Button({ iconType, onClick }) {
  return (
    <div className={locals.button} onClick={onClick}>
      <SvgIcon type={iconType} width={16} height={16} color="#fff" />
    </div>
  );
}
