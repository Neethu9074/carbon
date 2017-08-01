import React from 'react';

//import DashboardCloseButton from 'in-components/Dashboard/components/DashboardCloseButton';
import { routes$ } from 'in-stores/navigation/routes';
import connectTo from 'in-hoc/connectTo';

import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';

export default connectTo(
  {
    routes: routes$
  },
  function SwitchableViewHeader({ routes }) {
    return (
      <header className={`${block}`}>
        {routes.map((route, index) => {
          const title = route.title;
          if (title.toLowerCase() !== 'dashboard') {
            if (routes.length - 1 === index) {
              return route.title;
            } else {
              return `${route.title} > `;
            }
          }
        })}
      </header>
    );
  }
);
