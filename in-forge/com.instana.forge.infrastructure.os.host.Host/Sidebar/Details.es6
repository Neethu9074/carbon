import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';
import TagList from 'in-components/TagList/TagList';
import WiringList from 'in-components/WiringList';

import InterfaceList from '../InterfaceList';
import HostHardware from '../HostHardware';
import HostInfo from '../HostInfo';

const block = 'in-sidebar-server-details';

const OsDetails = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className={block}>
        <ProblemPanel snapshot={snapshot} />

        {this.getCollapsible('Host', <HostInfo snapshot={snapshot} />)}
        {this.getCollapsible('Interfaces', <InterfaceList snapshot={snapshot} />)}

        <TagList snapshot={snapshot} />
        <HostHardware snapshot={snapshot} />
        <WiringList snapshot={snapshot} />
      </div>
    );
  },

  getCollapsible(header, content) {
    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          {header}
        </Collapsible.Header>

        <Collapsible.Content>
          {content}
        </Collapsible.Content>
      </Collapsible>
    );
  }
});

export default OsDetails;
