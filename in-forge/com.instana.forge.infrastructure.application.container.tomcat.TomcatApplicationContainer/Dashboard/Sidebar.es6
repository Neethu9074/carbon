import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';
import WiringList from 'in-components/WiringList';

import TomcatInfo from '../TomcatInfo';

const rpt = React.PropTypes;
const TomcatSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Tomcat</Collapsible.Header>
          <Collapsible.Content>
            <TomcatInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <ProblemPanel snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default TomcatSidebar;
