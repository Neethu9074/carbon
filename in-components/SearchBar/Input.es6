import CodeMirror from 'codemirror/lib/codemirror.js';
import RoEmitter from 'roemitter';
import React from 'react';

import Suggestions from 'in-components/SearchBar/components/Suggestions';
import {generateBlocks} from 'in-components/SearchBar/stores/blocks';
import {replaceWith} from 'in-components/SearchBar/misc/stringUtils';
import {lex, getTokenForColumn} from 'in-stores/search/lexer';
import keyCodes from 'in-components/keyCodes';

import 'in-components/SearchBar/misc/codeMirrorModes';

// the order is important here
import 'codemirror/lib/codemirror.css';
import './Input.less';
import 'in-components/SearchBar/searchTokenDefinitions.less';


const block = 'in-searchbar-input';

export default React.createClass({

  displayname: 'SearchBar-Input',

  getInitialState() {
    return {
      eventEmitter: new RoEmitter(this.id),
      suggestionConfig: null
    };
  },

  componentDidMount() {
    const editor = this.editor = CodeMirror(this.input, {
      mode: 'instanaSearch',
      value: this.props.query,
      autofocus: true
    });

    let autocompleteShownForCursorPosition = null;

    editor.on('cursorActivity', () => {
      const currentCursorPosition = editor.getCursor().ch;
      if (autocompleteShownForCursorPosition != editor.getCursor().ch) {
        this.hide();
      }
      autocompleteShownForCursorPosition = currentCursorPosition;
    });

    editor.on('keydown', (editor, event) => {
      // open the suggestions when user hitting ctrl + space
      if (event.keyCode === keyCodes.space && event.ctrlKey) {
        event.preventDefault();

        const {left} = editor.cursorCoords({line: 0, ch: autocompleteShownForCursorPosition}, 'local');
        this.show({
          query: this.props.query,
          cursor: autocompleteShownForCursorPosition,
          left
        });
      }

      // send allowed navigation keys to the suggestions component
      if (event.keyCode === keyCodes.return ||
          event.keyCode === keyCodes.arrows.down ||
          event.keyCode === keyCodes.arrows.up) {
        event.preventDefault();
        this.state.eventEmitter.emit('keyDown', event.keyCode);
      }

      if (event.keyCode === keyCodes.arrows.left ||
          event.keyCode === keyCodes.arrows.right) {
        this.hide();
      }
    });

    editor.on('beforeChange', (editor, change) => {
      // users may not paste multi-line text. ensure that they can only single-line queries.
      if (change.origin === 'paste') {
        change.text = [change.text.join(' ')];
      }
    });

    editor.on('mousedown', () => {
      const currentQuery = this.props.query;
      if (currentQuery === '') {
        const {left} = editor.cursorCoords({line: 0, ch: autocompleteShownForCursorPosition}, 'local');
        this.show({
          query: currentQuery,
          cursor: autocompleteShownForCursorPosition,
          left
        });
      }
    });

    editor.on('blur', () => {
      this.state.eventEmitter.emit('blur', true);
    });

    editor.on('change', (editor, change) => {
      const query = this.editor.getValue();
      this.updateQuery(query);

      const tokens = lex(query);
      if (change.origin !== '+input') {
        return;
      }

      const changedToken = getTokenForColumn(tokens, change.to.ch);
      if (changedToken == null || changedToken.token !== 'term') {
        this.hide();
        return;
      }

      autocompleteShownForCursorPosition = change.to.ch + 1;

      const {left} = editor.cursorCoords({line: 0, ch: autocompleteShownForCursorPosition}, 'local');
      this.show({
        query,
        cursor: autocompleteShownForCursorPosition,
        left
      });
    });
  },

  componentWillUnmount() {
    // editor events are disposed via GC, so just "delete" the reference
    this.editor = null;

    this.state.eventEmitter.dispose();

    this.hide();
  },

  componentWillUpdate(nextProps) {
    // update the editor state if the query gets manipulated from outside
    if (this.props.query !== nextProps.query && nextProps.query !== this.editor.getValue()) {
      this.editor.setValue(nextProps.query);
    }
  },

  render() {
    return (
      <div className={block}>
        <div ref={input => this.input = input} />
        <Suggestions searchbarWidth={this.props.width}
                     eventEmitter={this.state.eventEmitter}
                     onSelectSuggestion={this.onSelectSuggestion}
                     config={this.state.suggestionConfig}
                     onClose={this.hide} />
      </div>
    );
  },

  onSelectSuggestion(e) {
    if (!e) {
      return;
    }

    const {string, cursorAfterInsertion} = replaceWith(
      this.props.query, // complete query
      e.replaceFrom, // position of the starting character of the current token
      e.replaceTo, // position of the ending character of the current token
      e.replaceWith // sequence which should be replaced with
    );

    this.editor.setValue(string);
    this.updateQuery(string);

    // set cursor to the end of the line
    this.editor.setCursor({line: 0, ch: cursorAfterInsertion});
  },

  updateQuery(newQuery) {
    const restQueryWithoutBlocks = generateBlocks(newQuery);
    if (restQueryWithoutBlocks !== newQuery) {
      this.editor.setValue(restQueryWithoutBlocks);
    }

    this.props.onChange(restQueryWithoutBlocks);
  },

  hide() {
    this.setState({ suggestionConfig: null });
  },

  show(suggestionConfig) {
    this.setState({ suggestionConfig });
  }
});
