import React from 'react/addons';

import {removeAllTagFilters} from 'in-stores/filtering';

import ResetButton from './ResetButton';
import TagListAll from '../TagListAll';
import ListHeader from './ListHeader';


const SidebarTagListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
