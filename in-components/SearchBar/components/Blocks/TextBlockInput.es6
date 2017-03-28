import CodeMirror from 'codemirror/lib/codemirror.js';
import React from 'react';

import keyCodes from 'in-components/keyCodes';

import 'in-components/SearchBar/misc/codeMirrorModes';

import './TextBlockInput.less';


const block = 'in-search-block-input';

export default React.createClass({

  displayName: 'TextBlockInput',

  componentDidMount() {
    const editor = this.editor = CodeMirror(this.input, {
      mode: 'instanaSearch',
      value: this.props.b.get('tokens').toArray().map(token => token.get('lexeme')).join(''),
      autofocus: true
    });

    editor.on('beforeChange', (editor, change) => {
      // users may not paste multi-line text. ensure that they can only single-line queries.
      if (change.origin === 'paste') {
        change.text = [change.text.join(' ')];
      }
    });

    editor.on('blur', () => {
      this.updateBlock();
    });

    editor.on('keydown', (editor, event) => {
      if (event.keyCode === keyCodes.return) {
        this.updateBlock();
      }
    });
  },

  componentWillUnmount() {
    // editor events are disposed via GC, so just "delete" the reference
    this.editor = null;
  },

  render() {
    return (
      <div className={block}>
        <div className={`${block}__input`}
             ref={input => this.input = input} />
      </div>
    );
  },

  updateBlock() {
    // null check because blur will fire after the editor was set to null
    if (this.editor) {
      this.props.onUpdateBlock({block: this.props.b, text: this.editor.getValue()});
    }
  }
});
