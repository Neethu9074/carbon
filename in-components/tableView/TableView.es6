import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EntityList from 'in-components/tableView/components/EntityList';

import './TableView.less';


const block = 'in-table-view';

export default React.createClass({
  displayName: 'TableView',

  mixins: [PureRenderMixin],

  propTypes: {
  },

  render() {
    return (
      <div className={block}>
        <EntityList />
      </div>
    );
  }
});
