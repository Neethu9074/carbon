/* eslint-disable max-len */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

// WARNING!
// prismjs requires this import order for language definitions.
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

// prism languages
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-sql.min.js';

// prism plugins
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import './Code.less';

const rpt = React.PropTypes;
const block = 'in-code';

export default React.createClass({
  displayName: 'Code',

  mixins: [PureRenderMixin],

  propTypes: {
    code: rpt.string.isRequired,
    lang: rpt.string,
    line: rpt.number,
    className: rpt.string
  },

  componentDidMount() {
    this.updateCode();
  },

  componentDidUpdate() {
    this.updateCode();
  },

  updateCode() {
    const codeElement = ReactDOM.findDOMNode(this.refs.code);
    const preElement = ReactDOM.findDOMNode(this.refs.pre);
    const code = this.props.code;
    let line = this.props.line;
    const lang = this.props.lang;


    if (line != null && lang === 'java') {
      line = getActualJavaLine(code, line);
    }

    preElement.dataset.line = line;
    codeElement.textContent = code;
    Prism.highlightElement(codeElement);

    const lineHighlight = preElement.querySelector('.line-highlight');
    if (lineHighlight) {
      lineHighlight.scrollIntoView();
    }
  },

  render() {
    let classes = block;
    if (this.props.lang) {
      classes = `${classes} language-${this.props.lang}`;
    }
    if (this.props.className) {
      classes = `${classes} ${this.props.className}`;
    }

    let preClasses = `${block}__wrapper`;
    if (this.props.lang !== 'java') {
      preClasses += ' line-numbers';
    }

    return (
      <pre ref='pre'
           className={preClasses}>
        <code className={classes}
              ref='code' />
      </pre>
    );
  }
});

function getActualJavaLine(code, givenLine) {
  const lineRegex = new RegExp('/\\*\\s*' + givenLine + '\\*/');
  const lines = code.split('\n');
  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    if (lineRegex.test(line)) {
      return i + 1;
    }
  }
  return null;
}
