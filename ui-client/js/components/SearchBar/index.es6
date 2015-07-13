'use strict';

import React from 'react/addons';
import eventBus from 'instana-ui-services/eventbus';
import {IntlMixin} from 'react-intl';

import './index.less';

const rpt = React.PropTypes;


export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    className: rpt.string
  },

  submit() {
    const text = document.getElementById('searchbar').value;
    eventBus.emit('filter', {filterText: text});
  },

  render() {
    let classes = 'in-searchbar';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <div className={classes}>
        <input id='searchbar' type='text' className='in-searchbar__input'/>
        <button type='button'
                className={'in-searchbar__button'}
                onClick={this.submit}>
          {this.getIntlMessage('map.searchbar.submit')}
        </button>
      </div>
    );
  }
});
