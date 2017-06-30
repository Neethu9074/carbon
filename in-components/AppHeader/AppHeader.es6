import React from 'react';

import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { homeLink$ } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import connectTo from 'in-hoc/connectTo';

import './AppHeader.less';

const block = 'in-app-header';

export default connectTo(
  {
    homeLink: homeLink$
  },
  function AppHeader({ homeLink }) {
    return (
      <div className={block}>
        <a href={homeLink} className={`${block}__lettering`}>
          <Lettering />
        </a>

        <ViewSwitcher />

        <div className={`${block}__right`}>
          <AccountMenu />
        </div>
      </div>
    );
  }
);
