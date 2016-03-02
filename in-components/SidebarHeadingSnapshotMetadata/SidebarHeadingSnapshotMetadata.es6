import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import React from 'react';

import {getClassName} from 'in-services/react';
import {getSingular} from 'in-sdk/pluginName';
import {getLongLabel} from 'in-sdk/snapshot';

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
        <div>
          <h1 className={block + '__label'}>
            <span className={block + '__text'}>
              {getLongLabel(snapshot)}
              <ZoneTag snapshotId={snapshot.get('id')} className={block + '__zone'}/>
            </span>
          </h1>

          <p className={block + '__plugin-type'}>
            {getSingular(snapshot.get('plugin'))}
          </p>
        </div>
      </div>
    );
  }
});

export default SidebarHeadingSnapshotMetadata;
