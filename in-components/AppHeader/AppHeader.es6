import React from 'react';

import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import {toggle, expanded$} from 'in-stores/search/searchBarExpanded';
import {evaluateClassNames} from 'in-services/util/classnames';
import {filtered$} from 'in-stores/search/filtered';
import Lettering from 'in-components/Lettering';
import {homeLink$} from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './AppHeader.less';

const block = 'in-app-header';

export default connectTo({
  homeLink: homeLink$,
  expanded: expanded$,
  filtered: filtered$
}, function AppHeader({homeLink, expanded, filtered}) {
  return (
    <div>
      <ViewSwitcher />

      <div className={evaluateClassNames({
             [block]: true,
             [`${block}--without-shadow`]: expanded
           })}>
        <a href={homeLink}
           className={`${block}__lettering`}>
          <Lettering />
        </a>

        <div className={`${block}__right`}>
          <Button className={evaluateClassNames({
                    [`${block}__toggle-search`]: true,
                    [`${block}__toggle-search--active`]: expanded,
                    [`${block}__toggle-search--filtered`]: filtered
                  })}
                  kind='secondary'
                  size='sm'
                  onClick={toggle}>
            <SvgIcon type='search'
                     height={13}
                     className={`${block}__toggle-search-icon`} />
          </Button>

          <AccountMenu />
        </div>
      </div>
    </div>
  );
});
