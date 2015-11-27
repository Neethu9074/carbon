import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import WiringList from 'in-components/WiringList';
import List from 'in-components/List';

import JVMInfo from '../JVMInfo';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const xargs = snapshot.getIn(['data', 'jvm.args']);

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Java</Collapsible.Header>
          <Collapsible.Content>
            <JVMInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {xargs ?
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>X Args</Collapsible.Header>
            <Collapsible.Content>
              <List>
                {xargs.map((arg, i) =>
                  <List.Item key={i}>{arg}</List.Item>
                ).toArray()}
              </List>
            </Collapsible.Content>
          </Collapsible>
        : null}
        <WiringList snapshot={snapshot} />
      </div>
    );
  }
});

export default Sidebar;
