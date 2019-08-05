import React from 'react';

import EntityWithType from 'in-new-components/EntityWithType';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityWithTypeAndIcon.mless';

export default function EntityWithTypeAndIcon({ label, type, iconType, href$ }) {
  return (
    <div className={locals.wrapper}>
      {iconType && <SvgIcon className={locals.entityIcon} type={iconType} />}
      <EntityWithType label={label} type={type} href$={href$} />
    </div>
  );
}
