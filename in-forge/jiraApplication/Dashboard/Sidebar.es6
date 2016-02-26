import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import JiraInfo from '../JiraInfo';

const JiraSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>JIRA</Collapsible.Header>
          <Collapsible.Content>
            <JiraInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default JiraSidebar;
