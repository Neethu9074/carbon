import React from 'react/addons';

import Heading from 'in-components/Tooltips/Heading';
import {getColor} from 'in-services/tags';

import './Tag.less';

const TagTooltip = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tag: React.PropTypes.string.isRequired
  },

  render() {
    const tag = this.props.tag;

    return (
      <Heading style={{color: getColor(tag)}}
               className='in-tooltip__tag-heading'>
        {tag}
      </Heading>
    );
  }
});

export default TagTooltip;
