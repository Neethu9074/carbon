import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';
import ZoneTag from '../ZoneTag';

import './Header.less';

const block = 'in-snapshot-sidebar-header';

const SidebarHeader = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className={block}>

        <h1 className={block + '__label'}>

          {getLabel(snapshot)}

          <HealthIcon snapshot={snapshot}
                      className={block + '__health'}/>

          <ZoneTag snapshot={snapshot}
                   className={block + '__zone'}/>
        </h1>

        <p className={block + '__plugin-type'}>
          {getSingular(snapshot.get('pluginId'))}
        </p>

      </div>
    );
  }
});

export default SidebarHeader;
