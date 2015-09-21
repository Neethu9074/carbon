import React from 'react/addons';

import Timeline from '../Timeline';
import Issues from './Issues';

import './Footer.less';

const block = 'in-footer';

const Footer = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    toggleNotificationCenter: React.PropTypes.func
  },

  render() {
    return (
      <div className={block}>
        <Issues onIssuesClicked={this.props.toggleNotificationCenter}/>
        <Timeline />
      </div>
    );
  }
});

export default Footer;
