/* eslint-disable react/no-find-dom-node */

import CodeMirror from 'codemirror/lib/codemirror.js';
import RoEmitter from 'roemitter';
import ReactDOM from 'react-dom';
import React from 'react';

import { setInputString, unvalidatedQuery$ } from 'in-stores/search/query';
import { onDown, onMove, onLeave } from 'in-services/reactiveMouseEvents';
import Suggestions from 'in-components/SearchBar/components/Suggestions';
import { replaceWith } from 'in-components/SearchBar/misc/stringUtils';
import { lex, getTokenForColumn } from 'in-stores/search/lexer';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { applyTransform } from 'in-services/util/dom';
import keyCodes from 'in-components/keyCodes';
import connectTo from 'in-hoc/connectTo';

import 'in-components/SearchBar/misc/codeMirrorModes';

// the order is important here
import 'codemirror/lib/codemirror.css';
import './Input.less';
import 'in-components/SearchBar/searchTokenDefinitions.less';

const blockEndClass = 'cm-custom-block--end';
const blockHighlightedClass = 'cm-custom-block--end--highlighted';
const block = 'in-searchbar-input';

export default getElementDimensions(
  connectTo(
    {
      query: unvalidatedQuery$
    },
    React.createClass({
      displayname: 'SearchBar-Input',

      getInitialState() {
        return {
          eventEmitter: new RoEmitter(this.id),
          suggestionConfig: null
        };
      },

      componentDidMount() {
        const editor = (this.editor = CodeMirror(this.input, {
          mode: 'instanaSearch',
          value: this.props.query,
          autofocus: true,
          scrollbarStyle: null
        }));

        let autocompleteShownForCursorPosition = null;
        let isFocused = false;

        editor.on('cursorActivity', () => {
          const currentCursorPosition = editor.getCursor().ch;
          if (autocompleteShownForCursorPosition != editor.getCursor().ch) {
            this.hide();
          }
          autocompleteShownForCursorPosition = currentCursorPosition;

          // The cursor position is fucked up at the end of block elements because we are using
          // CSS pseudo elements. We need to account for this and change the cursor position
          // using CSS transforms when the cursor is positioned at the end of a block element.
          const { ch } = editor.doc.getCursor();
          const cursor = ch - 1;
          const tokens = lex(this.editor.getValue());
          const token = getTokenForColumn(tokens, cursor);
          const domNode = ReactDOM.findDOMNode(this).querySelector('.CodeMirror-cursors');
          if (token && token.isBlockingEnd && tokens[tokens.length - 1] !== token && ch === token.end) {
            applyTransform(domNode, 'translate(-24px, 0)');
          } else {
            applyTransform(domNode, 'translate(0, 0)');
          }
        });

        editor.on('keydown', (editor, event) => {
          // open the suggestions when user hitting ctrl + space
          if (
            (event.keyCode === keyCodes.space && event.ctrlKey) ||
            (event.keyCode === keyCodes.arrows.down && this.state.suggestionConfig == null)
          ) {
            event.preventDefault();

            const query = this.props.query;
            const tokens = lex(query);
            const { left } = editor.cursorCoords({ line: 0, ch: autocompleteShownForCursorPosition }, 'local');
            const { field, fieldValue } = this.getFieldConfig(tokens, autocompleteShownForCursorPosition - 1);
            this.show({
              query,
              cursor: autocompleteShownForCursorPosition,
              left,
              field,
              fieldValue
            });
            return;
          }

          // send allowed navigation keys to the suggestions component
          if (
            event.keyCode === keyCodes.return ||
            event.keyCode === keyCodes.arrows.down ||
            event.keyCode === keyCodes.arrows.up
          ) {
            event.preventDefault();
            this.state.eventEmitter.emit('keyDown', event.keyCode);
          }

          if (event.keyCode === keyCodes.arrows.left || event.keyCode === keyCodes.arrows.right) {
            this.hide();
          }
        });

        editor.on('beforeChange', (editor, change) => {
          // users may not paste multi-line text. ensure that they can only single-line queries.
          if (change.origin === 'paste') {
            change.text = [change.text.join(' ')];
          }
        });

        editor.on('focus', () => {
          isFocused = true;
          this.openSuggestionWindowOnEmptyQuery(autocompleteShownForCursorPosition);
        });

        editor.on('mousedown', () => {
          this.openSuggestionWindowOnEmptyQuery(autocompleteShownForCursorPosition);
        });

        editor.on('blur', () => {
          isFocused = false;
          this.state.eventEmitter.emit('blur', true);
        });

        // TODO: make this better
        this.blurSubscription = this.state.eventEmitter
          .on('blur')
          .throttle(200, { leading: false })
          .subscribe(this.hide);

        editor.on('change', (editor, change) => {
          const { ch } = editor.doc.getCursor();
          const cursor = ch - 1;
          const query = this.editor.getValue();
          this.updateQuery(query);

          const tokens = lex(query);
          if (
            !isFocused || (change.origin !== '+input' && change.origin !== '+delete' && change.origin !== 'setValue')
          ) {
            return;
          }

          autocompleteShownForCursorPosition = cursor + 1;

          const { left } = editor.cursorCoords({ line: 0, ch: autocompleteShownForCursorPosition }, 'local');
          const { field, fieldValue } = this.getFieldConfig(tokens, cursor);
          if (field || fieldValue) {
            this.show({
              query,
              cursor: autocompleteShownForCursorPosition,
              left,
              field,
              fieldValue
            });
            return;
          }

          const changedToken = getTokenForColumn(tokens, cursor);
          if (
            changedToken == null ||
            (changedToken.token !== 'term' && changedToken.token !== 'field' && changedToken.token !== 'fieldSeparator')
          ) {
            this.hide();
            return;
          }

          this.show({
            query,
            cursor: autocompleteShownForCursorPosition,
            left
          });
        });

        const code = document.querySelector('.CodeMirror-code');
        this.clickSubscription = onDown(code, e => {
          if (isX(e, e.target)) {
            const match = e.target.className.match(/custom-blockId-[0-9]+/);
            if (match) {
              const parts = match[0].split('-');
              const blockId = parts[parts.length - 1];
              this.removeBlockFromQuery(blockId);
            }
          }
        });

        this.moveSubscription = onMove(code, e => {
          removeAllHighlightedClasses();
          if (isX(e, e.target)) {
            addHighlightingClass(e.target);
          }
        });

        this.leaveSubscription = onLeave(code, removeAllHighlightedClasses);
      },

      componentWillUnmount() {
        // editor events are disposed via GC, so just "delete" the reference
        this.editor = null;

        if (this.clickSubscription) {
          this.clickSubscription.dispose();
          this.clickSubscription = null;
        }
        if (this.moveSubscription) {
          this.moveSubscription.dispose();
          this.moveSubscription = null;
        }
        if (this.leaveSubscription) {
          this.leaveSubscription.dispose();
          this.leaveSubscription = null;
        }
        if (this.blurSubscription) {
          this.blurSubscription.dispose();
          this.blurSubscription = null;
        }

        this.state.eventEmitter.dispose();
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
            <Suggestions
              searchbarWidth={this.props.width}
              eventEmitter={this.state.eventEmitter}
              onSelectSuggestion={this.onSelectSuggestion}
              config={this.state.suggestionConfig}
            />
          </div>
        );
      },

      onSelectSuggestion(e) {
        if (!e) {
          return;
        }

        const { string, cursorAfterInsertion } = replaceWith(
          this.props.query, // complete query
          e.replaceFrom, // position of the starting character of the current token
          e.replaceTo, // position of the ending character of the current token
          e.replaceWith // sequence which should be replaced with
        );

        this.editor.setValue(string);
        this.updateQuery(string);

        // set cursor to the end of the line
        this.editor.setCursor({ line: 0, ch: cursorAfterInsertion });
      },

      updateQuery(newQuery) {
        if (this.editor.getValue() !== newQuery) {
          this.editor.setValue(newQuery);
        }

        setInputString(newQuery);
      },

      removeBlockFromQuery(blockId) {
        const tokens = this.editor.doc.mode.currentLexResult;
        let newQuery = '';
        for (let i = 0, length = tokens.length; i < length; i++) {
          const token = tokens[i];
          if (token.blockId !== blockId) {
            newQuery += token.lexeme;
          }
        }

        this.updateQuery(newQuery);
      },

      openSuggestionWindowOnEmptyQuery(autocompleteShownForCursorPosition) {
        const currentQuery = this.props.query;
        if (currentQuery === '') {
          const { left } = this.editor.cursorCoords({ line: 0, ch: autocompleteShownForCursorPosition }, 'local');
          this.show({
            query: currentQuery,
            cursor: autocompleteShownForCursorPosition,
            left
          });
        }
      },

      getFieldConfig(tokens, cursor) {
        const changedToken = getTokenForColumn(tokens, cursor);

        // handle auto completion for field values
        const previousToken = tokens[tokens.indexOf(changedToken) - 1];
        const previousPreviousToken = tokens[tokens.indexOf(previousToken) - 1];
        const startingFieldedValue = changedToken &&
          changedToken.token === 'fieldSeparator' &&
          previousToken &&
          previousToken.token === 'field';
        const inFieldedValue = changedToken &&
          (changedToken.token === 'phrase' || changedToken.token === 'term') &&
          previousToken &&
          previousToken.token === 'fieldSeparator' &&
          previousPreviousToken &&
          previousPreviousToken.token === 'field';
        if (startingFieldedValue || inFieldedValue) {
          return {
            field: startingFieldedValue ? previousToken.lexeme : previousPreviousToken.lexeme,
            fieldValue: startingFieldedValue ? '' : changedToken.lexeme
          };
        }
        return {};
      },

      hide() {
        this.setState({ suggestionConfig: null });
      },

      show(suggestionConfig) {
        this.setState({ suggestionConfig });
      }
    })
  )
);

function isX(mouseEvent, domElement) {
  if (!domElement) {
    return false;
  }
  if (domElement.className.indexOf(blockEndClass) >= 0) {
    const rect = domElement.getBoundingClientRect();
    if (mouseEvent.clientX > rect.right) {
      return true;
    }
  }
  return false;
}

function addHighlightingClass(domElement) {
  const indexOfClass = domElement.className.indexOf(blockHighlightedClass);
  if (indexOfClass < 0) {
    domElement.className += ` ${blockHighlightedClass}`;
  }
}

function removeAllHighlightedClasses() {
  const allHighlightedBlocks = document.querySelectorAll(`.${blockHighlightedClass}`);
  for (let i = 0, length = allHighlightedBlocks.length; i < length; i++) {
    allHighlightedBlocks[i].className = allHighlightedBlocks[i].className.replace(blockHighlightedClass, '');
  }
}
