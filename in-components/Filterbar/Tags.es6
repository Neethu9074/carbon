import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {removeAllTagFilters} from 'in-components/SearchBar/stores/searchInputString';
import TagListAll from 'in-components/TagListAll';

import ResetButton from 'in-components/Filterbar/ResetButton';
import TagsFilter from 'in-components/Filterbar/TagsFilter';
import ListHeader from 'in-components/Filterbar/ListHeader';


const SidebarTagListing = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div>
        <ListHeader header={'Tags'}/>
        <ResetButton onClick={removeAllTagFilters}/>
        <TagsFilter />
        <TagListAll/>
      </div>
    );
  }
});

export default SidebarTagListing;
