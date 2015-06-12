'use strict';

import React from 'react';
import Icon from 'instana-ui-components/Icon';
import classnames from 'instana-ui-services/util/classnames';
import {getZone} from 'instana-ui-sdk/zones';
import {getLabel} from 'instana-ui-sdk/snapshot';

import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as sidebarStore from 'instana-ui-services/stores/sidebar';

import './Header.less';

const Header = React.createClass({
  render() {
    const block = 'in-header';
    const snapshot = this.props.selectedSnapshot;
    const path = this.getPath(snapshot);

    return (
      <div className={classnames({
        [block]: true,
        [block + '--in-drilldown']: !!snapshot
      })}>
        <div className={block + '__navigation'}>
          <Icon type='arrow_left'
                className={classnames({
                  [block + '__back']: true,
                  [block + '__back--active']: !!snapshot
                })}
                onClick={this.onBack} />

          <ol className={block + '__breadcrumb'}>
            <li className={block + '__breadcrumb-item'}>
              Your Server Farm
            </li>
            {path.map((p, i) =>
              <div key={p}
                   className={block + '__breadcrumb-group'}>
                <li className={block + '__breadcrumb-separator'}>
                  /
                </li>
                <li className={classnames({
                  [block + '__breadcrumb-item']: true,
                  [block + '__breadcrumb-item--active']: i === path.length - 1
                })}>
                  {p}
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

  getPath() {
    const snapshot = this.props.selectedSnapshot;
    if (!snapshot) {
      return [];
    }

    const path = [];
    const zone = getZone(snapshot);
    path.push(zone);
    path.push(getLabel(snapshot));
    return path;
  },

  toggleSidebarVisibility() {
    sidebarStore.setVisibility(!this.props.sidebarVisible);
  },

  onBack() {
    selectedSnapshotStore.clear();
  }
});

export default Header;
