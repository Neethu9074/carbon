import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';
import List from 'in-components/List';

import JVMInfo from '../JVMInfo';

const Sidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const args = snapshot.getIn(['data', 'jvm.args']);

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Java</Collapsible.Header>
          <Collapsible.Content>
            <JVMInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {args ?
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>JVM Arguments</Collapsible.Header>
            <Collapsible.Content>
              <List>
                {args.map((arg, i) =>
                  <List.Item key={i}>{arg}</List.Item>
                ).toArray()}
              </List>
            </Collapsible.Content>
          </Collapsible>
        : null}
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }
});

export default Sidebar;
