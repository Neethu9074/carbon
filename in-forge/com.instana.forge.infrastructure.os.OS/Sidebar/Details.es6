import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';
import TagList from 'in-components/TagList/TagList';
import WiringList from 'in-components/WiringList';

import HostInfo from '../HostInfo';
import HostHardware from '../HostHardware';

const block = 'in-sidebar-server-details';

const OsDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Host</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <TagList snapshot={this.props.snapshot} />
        <HostHardware snapshot={this.props.snapshot} />
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }
});

export default OsDetails;
