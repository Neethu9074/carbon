import React from 'react';

import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import {evaluateClassNames} from 'in-services/util/classnames';
import {toggle, expanded$} from 'in-stores/search/expanded';
import Lettering from 'in-components/Lettering';
import {homeLink$} from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './AppHeader.less';

const block = 'in-app-header';

export default connectTo({
  homeLink: homeLink$,
  expanded: expanded$
}, function AppHeader({homeLink, expanded}) {
  return (
    <div>
      <ViewSwitcher />

      <div className={block}>
        <div className={`${block}__left`}>
          <a href={homeLink}
             className={`${block}__lettering`}>
            <Lettering />
          </a>

          <Button className={evaluateClassNames({
                    [`${block}__toggle-search`]: true,
                    [`${block}__toggle-search--active`]: expanded
                  })}
                  kind='secondary'
                  size='sm'
                  onClick={toggle}>
            <SvgIcon type='search'
                     width={10}
                     className={`${block}__toggle-search-icon`} />

            {expanded ? 'Hide seach bar' : 'Show search bar'}
          </Button>
        </div>

        <AccountMenu />
      </div>
    </div>
  );
});
