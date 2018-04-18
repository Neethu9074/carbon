import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './EntityWithTypeAndIcon.mless';

export default function EntityWithTypeAndIcon({ label, type, iconType, href$ }) {
  return (
    <div className={locals.wrapper}>
      {iconType && <SvgIcon className={locals.entityIcon} type={iconType} width={20} height={20} color="#6c8a91" />}
      <div className={locals.labelWrapper}>
        <span className={locals.type}>{type}</span>
        {href$ ? (
          <Link className={locals.wrapper} href$={href$}>
            {label}
          </Link>
        ) : (
          <span className={locals.label}>{label}</span>
        )}
      </div>
    </div>
  );
}
