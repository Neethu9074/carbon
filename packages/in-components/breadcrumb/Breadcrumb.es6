import React from 'react';

import { createTracker } from 'in-services/tracking/mixpanel';
import { joinClassNames } from 'in-services/util/classnames';
import { getIconSvgPath } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

const trackBreadcrumb = createTracker('navigation.breadcrumb');

export default function Breadcrumb({ className, children, href, href$, label, refSetter, icon, plugin }) {
  return (
    <Link
      href={href}
      href$={href$}
      className={joinClassNames(locals.breadcrumb, className)}
      onClick={() => trackBreadcrumb()}
    >
      <div className={locals.twoRowWrapper} ref={refSetter}>
        {(icon || plugin) && (
          <SvgIcon
            className={locals.icon}
            type={icon}
            iconPath={plugin && getIconSvgPath(plugin)}
            width={plugin ? 18 : 24}
            height={plugin ? 18 : 24}
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
