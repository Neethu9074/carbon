import React from 'react';

import { track, NAVIGATION_BREADCRUMB } from 'in-services/tracking/tracking';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ className, children, href, href$, label, refSetter, icon, iconPath, isActive }) {
  const breadcrumbClassName = (className = evaluateClassNames({
    [locals.breadcrumb]: true,
    [locals.activeBreadcrumb]: isActive,
    [className]: className
  }));
  let crumbContent = (
    <div className={locals.twoRowWrapper} ref={refSetter}>
      {(icon || iconPath) && (
        <SvgIcon
          className={locals.icon}
          type={icon}
          iconPath={iconPath}
          width={iconPath ? 18 : 24}
          height={iconPath ? 18 : 24}
        />
      )}

      <div className={locals.breadcrumbContent}>
        {label && <div className={locals.label}>{label}</div>}

        {children}
      </div>
    </div>
  );
  if (href || href$) {
    return (
      <Link href={href} href$={href$} className={breadcrumbClassName} onClick={() => track(NAVIGATION_BREADCRUMB)}>
        {crumbContent}
      </Link>
    );
  }
  return <div className={breadcrumbClassName}>{crumbContent}</div>;
}
