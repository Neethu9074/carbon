import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';
import List from 'in-components/List';

import CassandraCommunicationInfo from '../CassandraCommunicationInfo';
import CassandraTopologyInfo from '../CassandraTopologyInfo';

const CassandraSidebar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const tokens = data.get('tokens');

    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>
            Info
          </Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title='Version'>
                {data.get('version')}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>
            Topology
          </Collapsible.Header>
          <Collapsible.Content>
            <CassandraTopologyInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        {tokens ?
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              Tokens ({tokens.size})
            </Collapsible.Header>
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
          : null
        }

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>
            Communication
          </Collapsible.Header>
          <Collapsible.Content>
            <CassandraCommunicationInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

      </div>
    );
  }
});

export default CassandraSidebar;
