import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import KeyValuePopup from 'in-components/KeyValuePopup';
import RunningComponentsList from 'in-components/RunningComponentsList';

import SpringbootInfo from '../SpringbootInfo';

const SpringbootSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const data = this.props.snapshot.get('data');
    const applicationConfig = data.get('applicationConfig');

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Application Info</Collapsible.Header>
          <Collapsible.Content>
            <SpringbootInfo snapshot={snapshot}/>
          </Collapsible.Content>
        </Collapsible>

        { applicationConfig ?
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Application Config</Collapsible.Header>
            <Collapsible.Content>
              {applicationConfig.map((applicationConfigData, applicationConfigPath) =>
                  <KeyValuePopup key={applicationConfigPath} header={applicationConfigPath}
                                 data={applicationConfigData}/>
              ).valueSeq().toArray()}
            </Collapsible.Content>
          </Collapsible>
          : null }
        <RunningComponentsList snapshotId={snapshot.get('id')}/>
      </div>
    );
  }
});

export default SpringbootSidebar;
