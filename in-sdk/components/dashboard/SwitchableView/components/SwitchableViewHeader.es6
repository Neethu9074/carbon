import React from 'react';
import qs from 'qs';

//import DashboardCloseButton from 'in-components/Dashboard/components/DashboardCloseButton';
import { routes$ } from 'in-stores/navigation/routes';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';
const link = `${block}__link`;

export default connectTo(
  {
    routes: routes$
  },
  function SwitchableViewHeader({ routes, navigationParams }) {
    return (
      <header className={`${block}`}>
        {routes.map((route, index) => {
          const title = route.title;
          if (title.toLowerCase() !== 'dashboard') {
            if (routes.length - 1 === index) {
              return (
                <Link className={link} href={getNavigationPath(route.path, navigationParams)}>
                  {route.title}
                </Link>
              );
            } else {
              return (
                <Link className={link} href={getNavigationPath(route.path, navigationParams)}>
                  {`${route.title} > `}
                </Link>
              );
            }
          }
        })}
      </header>
    );
  }
);

function getNavigationPath(subPath, navigationParams) {
  let path = '#';
  const dashboard = 'dashboard';
  path += navigationParams.pathname.substring(0, navigationParams.pathname.indexOf(dashboard) + dashboard.length);
  path += subPath;
  path += `?${qs.stringify(navigationParams.query)}`;
  return path;
}
