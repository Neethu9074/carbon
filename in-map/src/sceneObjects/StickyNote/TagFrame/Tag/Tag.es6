import React from 'react/addons';

import {createTagFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';
import Tooltip from 'in-components/Tooltip';
import {getColor} from 'in-services/tags';

import TagToolTip from '../../../Tooltips/Tag';

import './Tag.less';

const rpt = React.PropTypes;
const TagStickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: rpt.string.isRequired,
    sceneObject: rpt.object.isRequired
  },

  onClick() {
    filters.addFilter(createTagFilter(this.props.tag));
  },

  render() {
     return (
       <Tooltip content={<TagToolTip tag={this.props.tag}/>}
                align={'right'}>

        <div style={{backgroundColor: getColor(this.props.tag)}}
             className='in-sticky-note__tag'
             onClick={this.onClick}>
        </div>

      </Tooltip>
    );
  }
});

export default TagStickyNote;
