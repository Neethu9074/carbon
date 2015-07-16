'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import './index.less';

const block = 'in-logout';

const Logout = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  logout() {
    console.log('LO');
  },

  render() {
    return (
      <button type='button'
              className={block}
              onClick={this.logout}>
        {this.getIntlMessage('map.logout.text')}
      </button>
    );
  }
});

export default Logout;
