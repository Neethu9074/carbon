import React from 'react';

import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import Lettering from 'in-components/Lettering';
import {homeLink$} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './AppHeader.less';


const block = 'in-app-header';

export default connectTo({
  homeLink: homeLink$
}, function AppHeader({homeLink}) {
  return (
    <div>
      <ViewSwitcher />

      <div className={block}>
        <div>
          <a href={homeLink}
             className={block + '__lettering-link'} >
            <Lettering />
          </a>
        </div>

        <AccountMenu />
      </div>
    </div>
  );
});
