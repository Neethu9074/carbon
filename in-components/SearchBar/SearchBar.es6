import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {query$, setQuery} from 'in-components/SearchBar/stores/searchStore';
import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';

import './SearchBar.less';


const rpt = React.PropTypes;
const block = 'in-searchbar';

export default connectTo({
    query: query$
  },
  React.createClass({

    displayName: 'SearchBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      className: rpt.string,
      query: rpt.string
    },

    render() {
      return (
        <div className={getClassName(this, block)}>
          <input type='search'
                 value={this.props.query}
                 onChange={e => setQuery(e.target.value)}
                 className={block + '__input'}
                 placeholder='Search…'
                 onClick={e => e.stopPropagation()}/>
        </div>
      );
    }
  })
);
