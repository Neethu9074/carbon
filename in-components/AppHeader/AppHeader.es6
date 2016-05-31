import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import NotificationCenterHeaderModule from 'in-components/notificationCenter/HeaderModule';
import ViewSwitcher from 'in-components/ViewSwitcher';
import AccountMenu from 'in-components/AccountMenu';
import Lettering from 'in-components/Lettering';

import './AppHeader.less';


const block = 'in-app-header';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'AppHeader',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    showSettingsMenu: rpt.func.isRequired
  },

  render() {
    return (
      <div className={block}>
        <Lettering className={block + '__lettering'}/>

        <ViewSwitcher />

        <div className={block + '__menu'}>
          <AccountMenu showMenu={this.props.showSettingsMenu} />
          <NotificationCenterHeaderModule />
        </div>
      </div>
    );
  }
});
