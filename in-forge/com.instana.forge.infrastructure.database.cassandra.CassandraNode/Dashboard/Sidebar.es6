import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Collapsible from 'in-components/Collapsible';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import List from 'in-components/List';

import CassandraTopologyInfo from '../CassandraTopologyInfo';
import CassandraCommunicationInfo from '../CassandraCommunicationInfo';

const CassandraSidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const tokens = data.get('tokens');

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Info</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title='Version'>
                {data.get('version')}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Topology</Collapsible.Header>
          <Collapsible.Content>
            <CassandraTopologyInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Tokens ({tokens.size})</Collapsible.Header>
          <Collapsible.Content>
            {tokens.size > 1 ?
              <List>
                {tokens.map((token, i) =>
                  <List.Item key={i}>{token}</List.Item>
                ).toArray()}
              </List>
            :
            <DescriptionList>
              <DescriptionItem title='Token'>
                {tokens[0]}
              </DescriptionItem>
            </DescriptionList>
          }
          </Collapsible.Content>
        </Collapsible>

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Communication</Collapsible.Header>
          <Collapsible.Content>
            <CassandraCommunicationInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>

      </div>
    );
  }

});

export default CassandraSidebar;
