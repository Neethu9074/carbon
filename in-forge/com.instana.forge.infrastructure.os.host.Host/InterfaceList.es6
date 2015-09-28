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
            {this.formatIPs(iface.get('ips'))}
          </DescriptionItem>
        ).toArray()}
      </DescriptionList>
    );
  },

  formatIPs(ips) {
    if (!ips) return null;
    // sort IPs based on their length, will make v4 come before v6
    const ipsSorted = ips.sort((a, b) => a.length - b.length);
    return (
      <span>
        {ipsSorted.map((ip) =>
          <div key={ip}>
            {ip}
          </div>
        )}
      </span>
    );
  }
});

export default InterfaceList;
