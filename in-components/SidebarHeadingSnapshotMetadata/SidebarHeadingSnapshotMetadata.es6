import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import React from 'react/addons';

import {getClassName} from 'in-services/react';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';

import HealthIcon from '../HealthIcon';
import ZoneTag from '../ZoneTag';

import './SidebarHeadingSnapshotMetadata.less';

const block = 'in-sidebar-heading-metadata';

const SidebarHeadingSnapshotMetadata = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    className: React.PropTypes.string,
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <div className={getClassName(this, block)}>
        <div>
          <h1 className={block + '__label'}>
            <span className={block + '__text'}>
              {getLabel(snapshot)}

              <ZoneTag snapshotId={snapshot.get('id')} className={block + '__zone'}/>
            </span>
          </h1>

          <p className={block + '__plugin-type'}>
            {getSingular(snapshot.get('pluginId'))}
          </p>
        </div>

        <div className={block + '__health'}>
          <HealthIcon snapshot={snapshot}/>
        </div>
      </div>
    );
  }
});

export default SidebarHeadingSnapshotMetadata;
