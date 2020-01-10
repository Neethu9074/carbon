import React from 'react';

import EntityWithType from 'in-new-components/EntityWithType';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityWithTypeAndIcon.mless';

export default function EntityWithTypeAndIcon({ label, type, renderType, iconType, iconPath, href$ }) {
  return (
    <div className={locals.wrapper}>
      {(iconType || iconPath) && <SvgIcon className={locals.entityIcon} type={iconType} iconPath={iconPath} />}
      <EntityWithType label={label} type={type} renderType={renderType} href$={href$} />
    </div>
  );
}
