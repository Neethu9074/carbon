import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { getFullNavigationPath } from 'in-stores/navigation';
import Link from 'in-components/Link';

import './NavigationTabs.less';

const block = 'in-navigation-tabs';

export default function NavigationTabs({ tabs, navigationParams }) {
  return (
    <div className={block}>
      <ul className={`${block}__container`}>
        {tabs.map(tab => {
          const linkElement = `${block}__link`;
          return (
            <li className={`${block}__nav-elements`} key={`link_${tab.path}`}>
              <Link
                href={getFullNavigationPath(tab.path, navigationParams)}
                className={evaluateClassNames({
                  [linkElement]: true,
                  [`${linkElement}--active`]: isActive(navigationParams, tab.path)
                })}
              >
                {tab.label}
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
