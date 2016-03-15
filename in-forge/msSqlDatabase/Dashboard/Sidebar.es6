import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-components/Collapsible';

import MsSqlInfo from '../MsSqlInfo';

const MsSqlSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {

    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>MS SQL-Server</Collapsible.Header>
          <Collapsible.Content>
            <MsSqlInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default MsSqlSidebar;
