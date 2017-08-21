import React from 'react';

import { compareTabsForRoutingPreference } from 'in-sdk/components/dashboard/TabView/components/paths';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { evaluateClassNames } from 'in-services/util/classnames';
import Link from 'in-components/Link';

import './NavigationTabs.less';

const block = 'in-navigation-tabs';

export default function NavigationTabs({ tabs, navigationParams }) {
  const path = getActiveDashboardSubPath(navigationParams);
  const tabsInRoutingOrder = tabs.slice(0).sort(compareTabsForRoutingPreference);

  let activeTab;
  for (let i = 0; i < tabsInRoutingOrder.length && activeTab == null; i++) {
    const tab = tabsInRoutingOrder[i];
    if (path.indexOf(tab.path) === 0 || `${path}/`.indexOf(tab.path) === 0) {
      activeTab = tab;
    }
  }

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
                  [`${linkElement}--active`]: tab === activeTab
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

function getActiveDashboardSubPath(navigationParams) {
  const dashboard = '/dashboard';
  const pathName = navigationParams.pathname;
  let path = pathName.substring(pathName.indexOf(dashboard) + dashboard.length, pathName.length);
  if (path.length === 0) {
    path = '/';
  }
  return path;
}
