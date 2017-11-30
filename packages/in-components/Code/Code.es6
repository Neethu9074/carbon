/* eslint-disable max-len */
import rpt from 'prop-types';
import React from 'react';

// WARNING!
// prismjs requires this import order for language definitions.
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

// prism languages
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-sql.min.js';
import 'prismjs/components/prism-ruby.min.js';
import 'prismjs/components/prism-yaml.min.js';
import 'prismjs/components/prism-php.min.js';

// prism plugins
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/autolinker/prism-autolinker.js';
import 'prismjs/plugins/autolinker/prism-autolinker.css';

import './Code.less';

const block = 'in-code';

export default class extends React.PureComponent {
  static displayName = 'Code';

  static propTypes = {
    code: rpt.string.isRequired,
    lang: rpt.string,
    id: rpt.string,
    line: rpt.number,
    className: rpt.string,
    wrapperClassName: rpt.string,
    showLineNumbers: rpt.bool
  };

  static defaultProps = {
    showLineNumbers: true
  };

  componentDidMount() {
    this.updateCode();
  }

  componentDidUpdate() {
    this.updateCode();
  }

  updateCode = () => {
    const codeElement = this.code;
    const preElement = this.pre;
    const code = this.props.code;
    let line = this.props.line;
    const lang = this.props.lang;

    if (line != null && lang === 'java') {
      line = getActualJavaLine(code, line);
    }

    if (line != null) {
      preElement.dataset.line = line;
    } else {
      try {
        preElement.dataset.line = '';
        preElement.removeAttribute('data-line');
        delete preElement.dataset.line;
      } catch (e) {
        // Ignore any errors that may occur when trying to delete a data attribute.
        // Happened in Safari on 2016-11-08.
      }
    }
    codeElement.textContent = code;
    Prism.highlightElement(codeElement);

    const lineHighlight = preElement.querySelector('.line-highlight');
    const scrollElement = document.querySelector('.in-code-retrieval-dialog__content');
    if (scrollElement && lineHighlight) {
      scrollElement.scrollTop = lineHighlight.offsetTop - scrollElement.clientHeight / 2;
    }
  };

  render() {
    let classes = block;
    if (this.props.lang) {
      classes = `${classes} language-${this.props.lang}`;
    }
    if (this.props.className) {
      classes = `${classes} ${this.props.className}`;
    }

    let preClasses = `${block}__wrapper`;
    if (this.props.showLineNumbers) {
      preClasses += ' line-numbers';
    }
    if (this.props.wrapperClassName) {
      preClasses += ` ${this.props.wrapperClassName}`;
    }

    return (
      <pre ref={pre => (this.pre = pre)} className={preClasses}>
        <code ref={code => (this.code = code)} className={classes} id={this.props.id || null} />
      </pre>
    );
  }
}

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
