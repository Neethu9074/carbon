import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import KeyValuePopup from 'in-components/KeyValuePopup';
import Collapsible from 'in-components/Collapsible';

import DockerInfo from '../DockerInfo';

const Sidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const labels = snapshot.getIn(['data', 'Labels']);

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>
            Docker Container
          </Collapsible.Header>
          <Collapsible.Content>
            <DockerInfo snapshot={snapshot} />

            <KeyValuePopup header='Container Labels'
                           data={labels} />
          </Collapsible.Content>
        </Collapsible>


        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default Sidebar;
