import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getForgeComponent from 'in-services/getForgeComponent';
import {getClassName} from 'in-services/react';

import Jail from '../Jail';

import './SidebarDetailList.less';

const block = 'in-sidebar-detail-list';

const SidebarDetailList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    useDetailedInformation: React.PropTypes.bool,
    className: React.PropTypes.string,
    snapshot: irpt.map.isRequired
  },

  getInitialState: function() {
    return { windowHeight: this.getWindowHeight() };
  },

  handleResize: function() {
    this.setState({ windowHeight: this.getWindowHeight() });
  },

  getWindowHeight() {
    // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
    // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
    return Math.max(100, window.innerHeight - 350);
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className={getClassName(this, block)}
           style={{ maxHeight: this.state.windowHeight }}>
        <Jail component={this.getForgeSpecificComponent('Details')}
              props={{ snapshot }}/>
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const pluginId = this.props.snapshot.get('pluginId');
    const path = this.props.useDetailedInformation ?
      './' + pluginId + '/Dashboard/Sidebar.es6' :
      './' + pluginId + '/Sidebar/' + name + '.es6';

    return getForgeComponent(path);
  }
});

export default SidebarDetailList;
