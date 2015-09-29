import React from 'react/addons';

import {getColor} from 'in-services/tags';

import './Tag.less';


const block = 'in-tag';

const Tag = React.createClass({
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
           onClick={this.props.onClick}>
        <div className={block + '__point'}
             style={{background: String(getColor(this.props.tag))}} />
        <span className={block + '__label'}>
          {this.props.tag}
        </span>
      </div>
    );
  }
});

export default Tag;
