import React from 'react';

import SearchButton from 'in-components/AppHeader/components/SearchButton';
import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { evaluateClassNames } from 'in-services/util/classnames';
import { expanded$ } from 'in-stores/search/searchBarExpanded';
import { homeLink$ } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import connectTo from 'in-hoc/connectTo';

import './AppHeader.less';

const block = 'in-app-header';

export default connectTo(
  {
    homeLink: homeLink$,
    expanded: expanded$
  },
  function AppHeader({ homeLink, expanded }) {
    return (
      <div
        className={evaluateClassNames({
          [block]: true,
          [`${block}--without-shadow`]: expanded
        })}
      >
        <a href={homeLink} className={`${block}__lettering`}>
          <Lettering />
        </a>

        <ViewSwitcher />

        <div className={`${block}__right`}>
          <SearchButton />
          <AccountMenu />
        </div>
      </div>
    );
  }
);
