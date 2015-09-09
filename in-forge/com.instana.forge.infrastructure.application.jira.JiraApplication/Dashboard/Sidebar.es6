import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';
import WiringList from 'in-components/WiringList';

import JiraInfo from '../JiraInfo';

const rpt = React.PropTypes;
const JiraSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>JIRA</Collapsible.Header>
          <Collapsible.Content>
            <JiraInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <ProblemPanel snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default JiraSidebar;
