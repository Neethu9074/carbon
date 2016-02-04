

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import MetricValue from 'in-components/MetricValue';

const JiraInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const snapshotId = this.props.snapshot.get('id');

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title='Issues'>
          <MetricValue metric={'instruments.entity.issues.total'}
                       snapshotId={snapshotId} />
        </DescriptionItem>
        <DescriptionItem title='Workflows'>
          <MetricValue metric={'instruments.entity.workflows.total'}
                       snapshotId={snapshotId} />
        </DescriptionItem>
        <DescriptionItem title='Custom Fields'>
          <MetricValue metric={'instruments.entity.customfields.total'}
                       snapshotId={snapshotId} />
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default JiraInfo;
