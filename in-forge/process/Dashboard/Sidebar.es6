import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import ProcessInfo from '../ProcessInfo';
import ArgList from '../ArgList';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Process</Collapsible.Header>
          <Collapsible.Content>
            <ProcessInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Arguments</Collapsible.Header>
          <Collapsible.Content>
            <ArgList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default Sidebar;
