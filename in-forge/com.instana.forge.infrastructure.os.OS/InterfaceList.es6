import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const InterfaceList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const ifaces = this.props.snapshot.getIn(['data', 'interfaces']);
    if (!ifaces) {
      return null;
    }

    return (
      <DescriptionList>
        {ifaces.map((iface, ifaceName) =>
          <DescriptionItem key={ifaceName} title={ifaceName}>
            {iface.get('ips')}
          </DescriptionItem>
        ).toArray()}
      </DescriptionList>
    );
  }
});

export default InterfaceList;
