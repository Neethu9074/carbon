import React from 'react/addons';

import Timeline from '../Timeline';
import Issues from '../Issues';
import Menu from '../Menu';

import './Footer.less';

const block = 'in-footer';

const Footer = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    showMenu: React.PropTypes.func
  },

  render() {
    return (
      <div className={block}>
        <Issues />
        <Timeline />
        <Menu showMenu={this.props.showMenu}/>
      </div>
    );
  }
});

export default Footer;
