import React from 'react/addons';

import Heading from 'in-components/Tooltips/Heading';
import {getColor} from 'in-services/tags';

import './MultiTag.less';

const MultiTag = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    tags: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <ul className='in-tooltip__multitag-frame--ul'>
        {this.props.tags.map((tag) => {
          return (
            <li key={tag} className='in-tooltip__multitag-frame--li'>
              <Heading style={{color: getColor(tag)}}
                       className='in-tooltip__multitag-heading'>
                {tag}
              </Heading>
            </li>
          );
        })}
      </ul>
    );
  }
});

export default MultiTag;
