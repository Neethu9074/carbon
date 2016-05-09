import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Group from 'in-components/tableView/components/Group';
import getViewStructure from 'in-hoc/getViewStructure';
import {emptyList} from 'in-services/fixedImmutables';

import './EntityList.less';


const block = 'in-table-view-entity-list';

export default getViewStructure(
  React.createClass({
    displayName: 'EntityList',

    mixins: [PureRenderMixin],

    propTypes: {
      viewStructure: irpt.map
    },

    render() {
      const viewStructure = this.props.viewStructure;
      if (!viewStructure) {
        return null;
      }

      return (
        <div className={block}>
          {viewStructure.get('children').map(group =>
            <Group key={group.get('id')}
                   snapshotId={group.get('id')}
                   hosts={group.get('children', emptyList)}/>
          )}
        </div>
      );
    }
  })
);
