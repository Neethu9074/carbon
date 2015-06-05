'use strict';

import React from 'react';
import Icon from 'instana-ui-components/Icon';
import classnames from 'instana-ui-services/util/classnames';

import './Header.less';

const Header = React.createClass({
  render() {
    const block = 'in-header';

    return (
      <div className={block}>
        <div className={block + '__navigation'}>
          <Icon type='arrow_left'
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
          <Icon type='menue'
                className={classnames({
                  [block + '__sidebar']: true,
                  [block + '__sidebar--active']: this.props.sidebarVisible
                })}
                onClick={this.toggleSidebarVisibility} />
        </div>
      </div>
    );
  },

  toggleSidebarVisibility() {
    this.props.onSidebarVisibilityChanged(!this.props.sidebarVisible);
  }
});

export default Header;
