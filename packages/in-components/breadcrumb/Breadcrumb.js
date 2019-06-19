import React from 'react';

import WithHealthIndication from 'in-components/health/WithHealthIndication';
import { track, NAVIGATION_BREADCRUMB } from 'in-services/tracking/tracking';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({
  className,
  children,
  href,
  href$,
  label,
  refSetter,
  icon,
  iconPath,
  isActive,
  healthInfo
}) {
  const breadcrumbClassName = evaluateClassNames({
    [locals.breadcrumb]: true,
    [locals.activeBreadcrumb]: isActive,
    [className]: className
  });
  const iconSize = iconPath ? 18 : 24;

  let iconCompontent = (
    <SvgIcon className={locals.icon} type={icon} iconPath={iconPath} width={iconSize} height={iconSize} />
  );

  if (healthInfo) {
    iconCompontent = (
      <WithHealthIndication size={iconSize} healthInfo={healthInfo}>
        {iconCompontent}
      </WithHealthIndication>
    );
  }

  let crumbContent = (
    <div className={locals.twoRowWrapper} ref={refSetter}>
      {(icon || iconPath) && iconCompontent}
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
