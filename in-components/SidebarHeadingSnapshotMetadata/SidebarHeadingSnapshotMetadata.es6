import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import React from 'react';

import HealthIcon from 'in-components/HealthIcon';
import {getClassName} from 'in-services/react';
import {getSingular} from 'in-sdk/pluginName';
import {getLabel} from 'in-sdk/snapshot';

import ZoneTag from '../ZoneTag';

import './SidebarHeadingSnapshotMetadata.less';

const block = 'in-sidebar-heading-metadata';

const SidebarHeadingSnapshotMetadata = React.createClass({
  mixins: [
    PureRenderMixin,
    Navigation
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
              <ZoneTag snapshotId={snapshot.get('id')} className={block + '__zone'}/>
              <HealthIcon snapshotId={snapshot.get('id')} className={block + '__icon'}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default SidebarHeadingSnapshotMetadata;
