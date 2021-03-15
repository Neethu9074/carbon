/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import WithHealthIndication from 'in-components/health/WithHealthIndication';
import { track, NAVIGATION_BREADCRUMB } from 'in-services/tracking/tracking';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({
  className,
  href,
  href$,
  label,
  refSetter,
  icon,
  onClick,
  isActive,
  healthInfo,
  children
}) {
  const breadcrumbClassName = classNames({
    [locals.breadcrumb]: true,
    [locals.clickable]: href || href$,
    [locals.activeBreadcrumb]: isActive,
    [className]: className
  });

  let iconCompontent = <SvgIcon className={locals.icon} type={icon} />;
  if (healthInfo) {
    iconCompontent = <WithHealthIndication healthInfo={healthInfo}>{iconCompontent}</WithHealthIndication>;
  }

  let crumbContent = (
    <div className={locals.twoRowWrapper} ref={refSetter}>
      {icon && iconCompontent}
      <div className={locals.breadcrumbContent}>{children ? children : label}</div>
    </div>
  );
  if (label) {
    crumbContent = (
      <Tooltip themeStyle="light" content={label}>
        {crumbContent}
      </Tooltip>
    );
  }
  if (href || href$) {
    return (
      <Link href={href} href$={href$} className={breadcrumbClassName} onClick={() => track(NAVIGATION_BREADCRUMB)}>
        {crumbContent}
      </Link>
    );
  }
  return (
    <div className={breadcrumbClassName} onClick={onClick}>
      {crumbContent}
    </div>
  );
}
