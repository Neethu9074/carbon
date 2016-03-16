import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-components/Collapsible';

import NginxInfo from '../NginxInfo';

const NginxSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Nginx</Collapsible.Header>
          <Collapsible.Content>
            <NginxInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <RunningComponentsList snapshotId={this.props.snapshot.get('id')} />
      </div>
    );
  }
});

export default NginxSidebar;
