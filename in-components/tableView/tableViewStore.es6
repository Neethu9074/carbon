import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getViewStructure from 'in-hoc/getViewStructure';

import './TableView.less';


const block = 'in-table-view';

export default getViewStructure(
  React.createClass({
    displayName: 'TableView',

    mixins: [PureRenderMixin],

    propTypes: {
      viewStructure: irpt.map
    },

    render() {
      return (
        <div className={block}>
        </div>
      );
    }
  })
);
