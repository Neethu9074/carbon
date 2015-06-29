'use strict';

import React from 'react/addons';
import Tag from './Tag';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    sceneObject: rpt.object.isRequired
  },

  render() {
    const tags = this.props.tags.map((tag) => {
      return <li key={tag.label} className='in-tooltip__node__tag-li'>
        <Tag tag={tag} sceneObject={this.props.sceneObject}/>
      </li>;
    });

    return (
      <div className="in-sticky-note__tag-frame">
        <ul className='in-tooltip__node__tag-ul'>
          {tags}
        </ul>
      </div>
    );
  }
});
