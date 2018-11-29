import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Link } from 'in-components/tables/sharedComponents';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TableLinkWithIcon.mless';

export default function TableLinkWithIcon({ icon, href$, href, children, isPrimary }) {
  return (
    <div className={locals.wrapper}>
      {icon && <SvgIcon className={locals.icon} type={icon} width={24} height={24} />}
      <Link
        className={evaluateClassNames({
          [locals.link]: true,
          [locals.nonPrimary]: !isPrimary
        })}
        href$={href$}
        href={href}
      >
        {children}
      </Link>
    </div>
  );
}
