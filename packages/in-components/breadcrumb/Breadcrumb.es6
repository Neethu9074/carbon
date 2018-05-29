import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ className, children, href, href$, label, refSetter, icon }) {
  return (
    <Link href={href} href$={href$} className={locals.breadcrumb}>
      <div className={joinClassNames(locals.twoRowWrapper, className)} ref={refSetter}>
        {icon && <SvgIcon className={locals.icon} type={icon} width={24} height={24} />}

        <div>
          {label && <div className={locals.label}>{label}</div>}

          {children}
        </div>
      </div>
    </Link>
  );
}
