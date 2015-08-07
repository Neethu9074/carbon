'use strict';

import React from 'react/addons';

import './QueryInput.less';

const rpt = React.PropTypes;
const block = 'in-query-builder__query-input';
const keyCodes = {
  enter: 13,
  escape: 27,
  up: 38,
  down: 40
};


const QueryInput = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    value: rpt.string.isRequired,
    onChange: rpt.func.isRequired,
    onConfirm: rpt.func.isRequired,
    onNextSuggestion: rpt.func.isRequired,
    onPreviousSuggestion: rpt.func.isRequired,
    onClear: rpt.func.isRequired
  },

  render() {
    return (
      <input type='text'
             className={block}
             value={this.props.value}
             onKeyUp={this.onKeyUp}
             onChange={this.onChange} />
    );
  },

  onChange(e) {
    this.props.onChange(e.target.value);
  },

  onKeyUp(e) {
    if (e.keyCode === keyCodes.enter) {
      this.props.onConfirm();
      e.preventDefault();
    } else if (e.keyCode === keyCodes.up) {
      this.props.onPreviousSuggestion();
      e.preventDefault();
    } else if (e.keyCode === keyCodes.down) {
      this.props.onNextSuggestion();
      e.preventDefault();
    } else if (e.keyCode === keyCodes.escape) {
      this.props.onClear();
      e.preventDefault();
    }
  }
});

export default QueryInput;
