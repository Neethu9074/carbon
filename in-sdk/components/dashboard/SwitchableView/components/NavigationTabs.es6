import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { getFullNavigationPath } from 'in-stores/navigation';
import Link from 'in-components/Link';

import './NavigationTabs.less';

const block = 'in-navigation-tabs';

export default function NavigationTabs({ navigation, navigationParams }) {
  if (navigation.tabs == null) {
    return null;
  }

  return (
    <div className={block}>
      <ul className={`${block}__container`}>
        {navigation.tabs.map(nav => {
          const linkElement = `${block}__link`;
          return (
            <li className={`${block}__nav-elements`} key={`link_${nav.path}`}>
              <Link
                href={getFullNavigationPath(nav.path, navigationParams)}
                className={evaluateClassNames({
                  [linkElement]: true,
                  [`${linkElement}--active`]: isActive(navigationParams, nav.path)
                })}
              >
                {nav.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function isActive(navigationParams, path) {
  const dashboard = 'dashboard';
  const pathName = navigationParams.pathname;
  let currentPath = pathName.substring(pathName.indexOf(dashboard) + dashboard.length, pathName.length);
  if (currentPath.length === 0) {
    currentPath = '/';
  }
  return currentPath === path;
}
