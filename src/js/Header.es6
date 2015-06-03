'use strict';

import React from 'react';
import Icon from 'instana-ui-components/Icon';

import './Header.less';

const Header = React.createClass({
  render() {
    const block = 'in-header';

    return (
      <div className={block}>
        <div className={block + '__navigation'}>
          <Icon type='long-arrow-left'
                className={block + '__back'}/>

          <ol className={block + '__breadcrumb'}>
            <li className={block + '__breadcrumb-item'}>
              Your Server Farm
            </li>
          </ol>
        </div>

        <div className={block + '__settings'}>
          <Icon type='search'
                className={block + '__search'} />
          <Icon type='bars'
                className={block + '__sidebar'} />
        </div>
      </div>
    );
  }
});

export default Header;
