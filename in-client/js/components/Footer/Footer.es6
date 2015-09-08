import React from 'react/addons';

import NotificationCenter from '../NotificationCenter';
import Timeline from '../Timeline';
import Issues from './Issues';
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

  getInitialState() {
    return { toggleNotificationCenter: false };
  },

  render() {
    return (
      <div className={block}>
        {this.state.toggleNotificationCenter ?
          <NotificationCenter /> :
          null}
        <Issues onIssuesClicked={this.onIssuesClicked}/>
        <Timeline />
        <Menu showMenu={this.props.showMenu}/>
      </div>
    );
  },

  onIssuesClicked() {
    this.setState({
      toggleNotificationCenter: !this.state.toggleNotificationCenter
    });
  }
});

export default Footer;
