import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {removeAllTagFilters} from 'in-stores/filtering';

import ResetButton from './ResetButton';
import TagListAll from '../TagListAll';
import ListHeader from './ListHeader';


const SidebarTagListing = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div>
        <ListHeader header={'Tags'}/>
        <ResetButton onClick={removeAllTagFilters}/>
        <TagListAll/>
      </div>
    );
  }
});

export default SidebarTagListing;
