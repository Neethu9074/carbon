import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

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
    const xargs = this.props.snapshot.getIn(['data', 'jvm.args']);
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Java</Collapsible.Header>
          <Collapsible.Content>
            <JVMInfo snapshot={this.props.snapshot} />
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
        <WiringList snapshot={this.props.snapshot} />
      </div>
    );
  }

});

export default Sidebar;
