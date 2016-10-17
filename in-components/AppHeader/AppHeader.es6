import React from 'react';

import AccountMenu from 'in-components/AccountMenu';
import SearchBar from 'in-components/SearchBar';
import Lettering from 'in-components/Lettering';
import {homeLink$} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './AppHeader.less';


const block = 'in-app-header';

export default connectTo({
  homeLink: homeLink$
}, function AppHeader({homeLink}) {
  return (
    <div className={block}>
      <div>
        <a href={homeLink}
           className={block + '__lettering-link'} >
          <Lettering />
        </a>
        <SearchBar className={block + '__search'} />
      </div>

      <AccountMenu />
    </div>
  );
});
