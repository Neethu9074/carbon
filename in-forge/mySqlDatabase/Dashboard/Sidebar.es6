import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import MySqlInfo from '../MySqlInfo';

const MySqlSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>MySql</Collapsible.Header>
          <Collapsible.Content>
            <MySqlInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default MySqlSidebar;
