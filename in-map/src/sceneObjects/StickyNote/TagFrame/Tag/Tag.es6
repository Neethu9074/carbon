import React from 'react/addons';

import {createTagFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';
import {getColor} from 'in-services/tags';

import './Tag.less';

const rpt = React.PropTypes;
const TagStickyNote = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: rpt.string.isRequired
  },

  onClick() {
    filters.addFilter(createTagFilter(this.props.tag));
  },

  getInitialState() {
    return { isVisible: true };
  },

  componentWillUnmount() {
    this.setState({
      isVisible: false
    });
  },

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    const tag = this.props.tag;

     return (
      <div style={{backgroundColor: getColor(tag)}}
           className='in-sticky-note__tag'
           onClick={this.onClick} />
    );
  }
});

export default TagStickyNote;
