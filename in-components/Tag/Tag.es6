import React from 'react/addons';

import {getColor} from 'in-services/tags';

import './Tag.less';


const block = 'in-tag';

const TagList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    tag: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },

  render() {
    return (
      <div className={block}
           onClick={this.props.onClick}
           style={{borderColor: String(getColor(this.props.tag))}}>
        {this.props.tag}
      </div>
    );
  }
});

export default TagList;
