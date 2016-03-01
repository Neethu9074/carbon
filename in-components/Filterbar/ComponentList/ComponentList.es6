import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getViewStructure from 'in-hoc/getViewStructure';

import ComponentItem from './ComponentItem';
import Component from './Component';


export default getViewStructure(
               React.createClass({

  displayName: 'ComponentList',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    viewStructure: irpt.map
  },

  render() {
    const viewStructure = this.props.viewStructure;
    if (!viewStructure) {
      return null;
    }

    return (
      <div>
        {viewStructure.get('children').map(group =>
          <Component key={group.get('id')}
                     snapshotId={group.get('id')}>
            {group.get('children').map(host =>
              <ComponentItem key={host.get('id')}
                             snapshotId={host.get('id')} />)
            }
          </Component>
        )}
      </div>
    );
  }
}));
