import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';

export default React.createClass({
  displayName: 'UnmonitoredHostSidebar',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Network Information</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title='IPv4'>
                {this.props.snapshot.getIn(['data', 'ipv4'])}
              </DescriptionItem>
              <DescriptionItem title='Reverse Lookup'>
                {this.props.snapshot.getIn(['data', 'dnsName'])}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});
