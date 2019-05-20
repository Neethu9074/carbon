import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './EntityWithTypeAndIcon.mless';

export default function EntityWithTypeAndIcon({ label, type, iconType, href$ }) {
  return (
    <div className={locals.wrapper}>
      {iconType && <SvgIcon className={locals.entityIcon} type={iconType} width={24} height={24} />}
      <div className={locals.labelWrapper}>
        <div className={locals.type}>{type}</div>
        {href$ ? (
          <Link className={locals.link} href$={href$}>
            {label}
          </Link>
        ) : (
          <span className={locals.label}>{label}</span>
        )}
      </div>
    </div>
  );
}
