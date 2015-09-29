import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';
import WiringList from 'in-components/WiringList';

import MySqlInfo from '../MySqlInfo';

const rpt = React.PropTypes;

const MySqlSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>MySql</Collapsible.Header>
          <Collapsible.Content>
            <MySqlInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <ProblemPanel snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default MySqlSidebar;
