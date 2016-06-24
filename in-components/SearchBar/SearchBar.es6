import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {inputString$, setInputString} from 'in-components/SearchBar/stores/searchInputString';
import {disableShortcuts, enableShortcuts} from 'in-stores/shortcuts';
import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './SearchBar.less';


const rpt = React.PropTypes;
const block = 'in-searchbar';

export default connectTo({
    inputString: inputString$
  },
  React.createClass({

    displayName: 'SearchBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      className: rpt.string,
      inputString: rpt.string
    },

    render() {
      return (
        <div className={getClassName(this, block)}>
          <Icon type='search'
                className={block + '__search-icon'}/>


          <input type='search'
                 value={this.props.inputString}
                 onChange={e => setInputString(e.target.value)}
                 onFocus={disableShortcuts}
                 onBlur={enableShortcuts}
                 className={block + '__input'}
                 placeholder='Search…'
                 onClick={e => e.stopPropagation()}/>

        </div>
      );
    }
  })
);
