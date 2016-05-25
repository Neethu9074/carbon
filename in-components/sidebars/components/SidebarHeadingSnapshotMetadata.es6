import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import HealthIconListing from 'in-components/HealthIconListing';
import {getClassName} from 'in-services/react';
import {getSingular} from 'in-sdk/pluginName';
import ZoneTag from 'in-components/ZoneTag';
import {getLabel} from 'in-sdk/snapshot';

import './SidebarHeadingSnapshotMetadata.less';


const block = 'in-sidebar-heading-metadata';

export default React.createClass({

  displayName: 'SidebarHeadingSnapshotMetadata',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    snapshot: irpt.map.isRequired
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }
    const snapshotId = snapshot.get('id');

    return (
      <div className={getClassName(this, block)}>
        <div className={block + '__type-zone-wrapper'}>
          <h1 className={block + '__label'}>
            <span className={block + '__text'}>
              {getLabel(snapshot)}
            </span>
          </h1>

          <div className={block + '__wrapper'}>
            <span className={block + '__plugin-type'}>
              {getSingular(snapshot.get('plugin'))}
            </span>
            <div className={block + '__wrapper'}>
              <ZoneTag snapshotId={snapshotId} className={block + '__zone'}/>
              <HealthIconListing snapshotId={snapshotId}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
