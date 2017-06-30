import React from 'react';
import qs from 'qs';

import './NavigationTabs.less';

const block = 'in-navigation-tabs';

export default function NavigationTabs({ navigationStructure, navigationParams }) {
  const isActive = (navigationParams, path) => {
    const dashboard = 'dashboard';
    const pathName = navigationParams.pathname;
    let currentPath = pathName.substring(pathName.indexOf(dashboard) + dashboard.length, pathName.length);
    if (currentPath.length === 0) {
      currentPath = '/';
    }
    return currentPath === path;
  };

  const getNavigationPath = (subPath, navigationParams) => {
    let path = '#';
    const dashboard = 'dashboard';
    path += navigationParams.pathname.substring(0, navigationParams.pathname.indexOf(dashboard) + dashboard.length);
    path += subPath;
    path += `?${qs.stringify(navigationParams.query)}`;
    return path;
  };

  return (
    <div className={block}>
      <ul className={`${block}__container`}>
        {navigationStructure.map(nav => {
          const activeClassName = isActive(navigationParams, nav.path) ? `${block}__link__active` : '';
          return (
            <li className={`${block}__nav-elements`} key={`link_${nav.path}`}>
              <a href={getNavigationPath(nav.path, navigationParams)} className={`${block}__link ${activeClassName}`}>
                {nav.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
