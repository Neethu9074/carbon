import React from 'react';

import { createTracker } from 'in-services/tracking/mixpanel';
import { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

const trackBreadcrumb = createTracker('navigation.breadcrumb');

export default function Breadcrumb({ className, children, href, href$, label, refSetter, icon, iconPath }) {
  return (
    <Link
      href={href}
      href$={href$}
      className={joinClassNames(locals.breadcrumb, className)}
      onClick={() => trackBreadcrumb()}
    >
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
    </Link>
  );
}
