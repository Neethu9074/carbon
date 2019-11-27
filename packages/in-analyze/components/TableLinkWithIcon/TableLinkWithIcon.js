import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Link } from 'in-components/tables/sharedComponents';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TableLinkWithIcon.mless';

export default function TableLinkWithIcon({ icon, iconPath, href$, href, onClick, children, isPrimary }) {
  return (
    <div className={locals.wrapper}>
      {(icon || iconPath) && <SvgIcon className={locals.icon} type={icon} iconPath={iconPath} />}
      <Link
        className={evaluateClassNames({
          [locals.link]: true,
          [locals.nonPrimary]: !isPrimary
        })}
        onClick={onClick}
        href$={href$}
        href={href}
      >
        {children}
      </Link>
    </div>
  );
}
