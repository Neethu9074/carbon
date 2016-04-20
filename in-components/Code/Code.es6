import PureRenderMixin from 'react-addons-pure-render-mixin';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import ReactDOM from 'react-dom';
import React from 'react';

import './Code.less';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'Code',

  mixins: [PureRenderMixin],

  propTypes: {
    code: rpt.string.isRequired,
    type: rpt.string.isRequired
  },

  componentDidMount() {
    this.updateCode();
  },

  componentDidUpdate() {
    this.updateCode();
  },

  updateCode() {
    const element = ReactDOM.findDOMNode(this.refs.code);
    element.textContent = this.props.code;
    hljs.highlightBlock(element);
  },

  render() {
    return (
      <pre>
        <code className={`in-code lang-${this.props.type}`}
              ref='code' />
      </pre>
    );
  }
});
