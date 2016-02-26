import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';
import PopUpable from 'in-components/PopUpable';

import DockerLabels from '../DockerLabels';
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
            {labels && labels.size > 0 ?
              <PopUpable>
              <PopUpable.Header>
              Container Labels
              </PopUpable.Header>
              <PopUpable.Content>
              <DockerLabels labels={labels}/>
              </PopUpable.Content>
              </PopUpable>
              : null}
          </Collapsible.Content>
        </Collapsible>


        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default Sidebar;
