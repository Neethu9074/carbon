'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Panel from 'in-components/Panel';
import JVMInfo from '../JVMInfo';

const rpt = React.PropTypes;
const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    const xargs = this.props.snapshot.getIn(['data', 'jvm.args']);
    return (
      <div>
        <Panel title='Java'>
          <JVMInfo snapshot={this.props.snapshot} />
        </Panel>
        <Panel title='X Args'>
          <ul>
            {xargs.map((arg, i) =>
              <li style={{'whiteSpace': 'nowrap'}}
                  key={i}>
                {arg}
              </li>
            ).toArray()}
          </ul>
        </Panel>
      </div>
    );
  }

});

export default Sidebar;
