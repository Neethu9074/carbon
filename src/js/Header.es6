'use strict';

import React from 'react';
import Icon from 'instana-ui-components/Icon';
import classnames from 'instana-ui-services/util/classnames';

import './Header.less';

const Header = React.createClass({
  render() {
    const block = 'in-header';

    return (
      <div className={classnames({
        [block]: true,
        [block + '--in-drilldown']: this.props.backEnabled
      })}>
        <div className={block + '__navigation'}>
          <Icon type='arrow_left'
                className={classnames({
                  [block + '__back']: true,
                  [block + '__back--active']: this.props.backEnabled
                })}
                onClick={this.props.onBack} />

          <ol className={block + '__breadcrumb'}>
            <li className={block + '__breadcrumb-item'}>
              Your Server Farm
            </li>
            {this.props.path.map((path, i) =>
              <div key={path}
                   className={block + '__breadcrumb-group'}>
                <li className={block + '__breadcrumb-separator'}>
                  /
                </li>
                <li className={classnames({
                  [block + '__breadcrumb-item']: true,
                  [block + '__breadcrumb-item--active']: i === this.props.path.length - 1,
                })}>
                  {path}
                </li>
              </div>
            )}
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
