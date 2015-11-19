import React from 'react/addons';

import {isProductionEnvironment} from 'in-services/config';

import './MenuFooter.less';

const block = 'in-menu-footer';

const MenuFooter = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
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
  }
});

export default MenuFooter;
