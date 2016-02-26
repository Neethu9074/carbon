import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import helpify from '../hoc/helpify';

import './HelpLink.less';

const block = 'in-help-link';
const rpt = React.PropTypes;

const HelpLink = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    showHelp: rpt.func.isRequired,
    helpId: rpt.string.isRequired,
    children: rpt.any.isRequired
  },

  render() {
    return (
      <a href='#'
         onClick={this.showHelp}
         className={block}
         title='Open help information'>
        {this.props.children}
      </a>
    );
  },

  showHelp(e) {
    e.preventDefault();
    this.props.showHelp(this.props.helpId);
  }
});

export default helpify(HelpLink);
