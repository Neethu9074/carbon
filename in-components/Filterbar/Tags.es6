import React from 'react/addons';

import * as filters from 'in-services/stores/filters';

import ResetButton from './ResetButton';
import TagListAll from '../TagListAll';
import ListHeader from './ListHeader';


const SidebarTagListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div>
        <ListHeader header={'Tags'}/>
        <ResetButton onClick={this.clearAllTags}/>
        <TagListAll/>
      </div>
    );
  },

  clearAllTags() {
    filters.removeFiltersWithType('tag');
  }
});

export default SidebarTagListing;
