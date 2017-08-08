import React from 'react';

import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { evaluateClassNames } from 'in-services/util/classnames';
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
                href$={getSubDashboardLink(tab.path)}
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
