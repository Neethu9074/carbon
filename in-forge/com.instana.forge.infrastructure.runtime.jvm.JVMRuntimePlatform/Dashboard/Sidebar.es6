'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';
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
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Java</Collapsible.Header>
          <Collapsible.Content>
            <JVMInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>X Args</Collapsible.Header>
          <Collapsible.Content>
            <ul>
              {xargs.map((arg, i) =>
                <li style={{'whiteSpace': 'nowrap'}}
                    key={i}>
                  {arg}
                </li>
              ).toArray()}
            </ul>
          </Collapsible.Content>
        </Collapsible>
        <ProblemPanel snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
