import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const JettyConnectors = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const connectors = this.props.snapshot.getIn(['data', 'connectors']);

    return (
      <div>
        {connectors.map(connector =>
          <Collapsible initiallyOpen={false} key={connector.get('port')}>
            <Collapsible.Header>Connector @{connector.get('port')}</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title='Port'>
                  {connector.get('port')}
                </DescriptionItem>
                <DescriptionItem title='Protocols'>
                  {connector.get('protocols').join(', ')}
                </DescriptionItem>
                <DescriptionItem title='State'>
                  {connector.get('state')}
                </DescriptionItem>
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  }
});

export default JettyConnectors;
