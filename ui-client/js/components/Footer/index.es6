'use strict';

import React from 'react/addons';
import Issues from '../Issues';
import Timeline from '../Timeline';
import SignOut from '../SignOut';

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
        <SignOut />
      </div>
    );
  }
});

export default Footer;
