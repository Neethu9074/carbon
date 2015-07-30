'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Panel from 'in-components/Panel';
import DockerInfo from '../DockerInfo';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Panel title='Process'>
          <DockerInfo snapshot={this.props.snapshot} />
        </Panel>
      </div>
    );
  }

});

export default Sidebar;
