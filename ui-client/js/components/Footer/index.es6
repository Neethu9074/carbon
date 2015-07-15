'use strict';

import React from 'react/addons';
import Issues from '../Issues';
import Timeline from '../Timeline';
import Logout from '../Logout';

import './index.less';

const block = 'in-footer';

const Footer = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  render() {
    return (
      <div className={block}>
        <Issues />
        <Timeline />
        <Logout />
      </div>
    );
  }
});

export default Footer;
