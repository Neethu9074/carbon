import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {closeMenu} from 'in-components/AccountMenu/accountMenuStore';
import {isProductionEnvironment} from 'in-services/config';
import {showReleaseNotes} from 'in-stores/releaseNotes';

import './MenuFooter.less';

const block = 'in-menu-footer';

const MenuFooter = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    onClick: React.PropTypes.func
  },

  render() {

    return (
      <div className={block}>

        <div onClick={this.props.onClick}
             className={block + '__settings'}>
          Settings
        </div>

        <div onClick={this.onClickReleaseNotes}
             className={block + '__release-notes'}>
          Release Notes
        </div>


        {isProductionEnvironment() ?
          <form action='/auth/signOut' method='post'>
            <button type='submit'
                    className={block + '__signout'}>
              Logout
            </button>
          </form>
        : null}

      </div>
    );
  },

  onClickReleaseNotes() {
    showReleaseNotes();
    closeMenu();
  }
});

export default MenuFooter;
