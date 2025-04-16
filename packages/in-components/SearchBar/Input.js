/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { keyCodes } from '@instana/components';
import RoEmitter from '@instana/roemitter';

import { onDown, onMove, onLeave } from 'in-services/util/reactiveMouseEvents';
import { setQueryInput, unvalidatedQuery$ } from 'in-stores/search/query';
import Suggestions from 'in-components/SearchBar/components/Suggestions';
import { replaceWith } from 'in-components/SearchBar/misc/stringUtils';
import { tryFocusSearch } from 'in-components/SearchBar/stores/focus';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { getTokenForColumn, lex } from 'in-stores/search/lexer';
import ErrorBoundary from 'in-components/ErrorBoundary';
import 'in-components/SearchBar/misc/codeMirrorModes';
import { applyTransform } from 'in-services/util/dom';
import CodeMirror from 'in-components/CodeMirror';
import connectTo from 'in-hoc/connectTo';

import 'in-components/SearchBar/searchTokenDefinitions.less';
import './Input.less';

const { isSpace, isCtrl, isReturn, isArrowUp, isArrowDown, isArrowLeft, isArrowRight, isEscape, isTab } = keyCodes;
const blockEndClass = 'cm-custom-block--end';
const blockHighlightedClass = 'cm-custom-block--end--highlighted';
const block = 'in-searchbar-input';
const SearchBarInput = connectTo(
  {
    contextQuery: unvalidatedQuery$
  },
  class SearchBarInput extends React.Component {
    componentDidMount() {
      const editor = (this.editor = CodeMirror(this.input, {
        mode: 'instanaSearch',
        value: this.props.contextQuery.query,
        autofocus: false,
        scrollbarStyle: null,
        searchContext: this.props.contextQuery.searchContext,
        readOnly: this.props.disabled,
        disableInput: this.props.disabled
      }));

      this.editor.setValue(this.props.queryValue ?? '');

      let autocompleteShownForCursorPosition = null;
      this.isFocused = false;
      this.focusByUserClick = false;

      if (this.props.disabled) {
        return;
      }

      editor.on('cursorActivity', () => {
        const currentCursorPosition = editor.getCursor().ch;
        if (autocompleteShownForCursorPosition != currentCursorPosition) {
          // this.hide();
        }
        autocompleteShownForCursorPosition = currentCursorPosition;

        // The cursor position is fucked up at the end of block elements because we are using
        // CSS pseudo elements. We need to account for this and change the cursor position
        // using CSS transforms when the cursor is positioned at the end of a block element.
        const { ch } = editor.doc.getCursor();
        const cursor = ch - 1;
        const tokens = lex(editor.getValue());
        const token = getTokenForColumn(tokens, cursor);
        const domNode = this.input.querySelector('.CodeMirror-cursors');
        if (token && token.isBlockingEnd && tokens[tokens.length - 1] !== token && ch === token.end) {
          applyTransform(domNode, 'translate(-24px, 0)');
        } else {
          applyTransform(domNode, 'translate(0, 0)');
        }
      });

      editor.on('keydown', (editor, event) => {
        // open the suggestions when user hitting ctrl + space
        if ((isSpace(event) && isCtrl(event)) || (isArrowDown(event) && this.state.suggestionConfig == null)) {
          event.preventDefault();

          const query = this.props.contextQuery.query;
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
        if (isReturn(event) || isArrowDown(event) || isArrowUp(event)) {
          event.preventDefault();
          this.state.eventEmitter.emit('keyDown', event);
        }

        if (isArrowLeft(event) || isArrowRight(event) || isEscape(event)) {
          this.hide();
        }
        if (isTab(event) && !event.shiftKey) {
          this.focusNextElement();
          this.hide();
        }
        if (isTab(event) && event.shiftKey) {
          this.focusNextElement(false);
          this.hide();
        }
      });

      editor.on('beforeChange', (editor, change) => {
        // users may not paste multi-line text. ensure that they can only single-line queries.
        if (change.origin === 'paste') {
          change.text = [change.text.join(' ')];
        }

        const query = editor.getValue();
        const { ch } = editor.getCursor();
        const cursor = ch - 1;
        const tokens = lex(query);
        const changedToken = getTokenForColumn(tokens, cursor);

        // we want to support typing flow
        if (
          change &&
          change.origin === '+input' && // only on add input
          change.text[0] === '"' &&
          changedToken &&
          changedToken.lexeme.length > 1 && // more than 1 character
          changedToken.lexeme.indexOf('"') === 0 && // starts with "
          changedToken.end - 1 === cursor &&
          changedToken.token === 'phrase' &&
          changedToken.lexeme[changedToken.lexeme.length - 1] !== '"' // ends with "
        ) {
          change.text = [change.text + ' '];
        }
      });

      editor.on('focus', () => {
        this.isFocused = true;
        this.openSuggestionWindowOnEmptyQuery(autocompleteShownForCursorPosition);
        if (this.focusByUserClick) {
          onChange();
        }
        this.focusByUserClick = false;
      });

      editor.on('mousedown', (editor, event) => {
        // Add a space at the end of the query when the query clicks after the last block. This is helpful as
        // otherwise the cursor will be positioned within the block, even though this is rarely what the user
        // wants.
        const lastCharacterElement = document.querySelector(
          '.in-searchbar .CodeMirror-code .cm-character.cm-custom-block--end:last-child'
        );
        if (lastCharacterElement && lastCharacterElement.getBoundingClientRect().right < event.screenX + 5) {
          editor.setValue(editor.getValue());
        }
        this.openSuggestionWindowOnEmptyQuery(autocompleteShownForCursorPosition);
      });

      editor.on('blur', () => {
        if (this.editor) {
          this.updateQuery(trim(this.editor.getValue()));
        }
        this.isFocused = false;
        this.state.eventEmitter.emit('blur', true);
      });

      this.blurSubscription = this.state.eventEmitter
        .on('blur')
        .throttle(200, { leading: false })
        .subscribe(() => {
          if (!this.isFocused) {
            this.hide();
          }
        });

      editor.on('change', (editor, change) => {
        const query = editor.getValue();
        this.updateQuery(trim(query));

        if (
          !this.props.manageFiltersDisabled &&
          (!this.isFocused ||
            (change.origin !== '+input' && change.origin !== '+delete' && change.origin !== 'setValue'))
        ) {
          return;
        }

        onChange(change, editor);
      });

      const onChange = () => {
        const query = editor.getValue();
        if (this.props.manageFiltersDisabled) {
          this.props.onQueryValueChange(query);
        }
        const { ch } = editor.getCursor();
        const cursor = ch - 1;
        const tokens = lex(query);
        const changedToken = getTokenForColumn(tokens, cursor);

        autocompleteShownForCursorPosition = ch;

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
      };

      const code = this.input.querySelector('.CodeMirror-code');
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
    }

    focusNextElement(next = true) {
      // add all elements we want to include in our selection
      const focussableSelectors =
        'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
      const nodelist = document.querySelectorAll(focussableSelectors);
      const focussableElements = Array.from(nodelist);
      const index = focussableElements.indexOf(document.activeElement);
      if (index > -1) {
        const nextElement = focussableElements[next ? index + 1 : index - 1] || focussableElements[0];
        nextElement.focus();
      }
    }

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
    }

    componentDidUpdate() {
      // update the editor state if the query gets manipulated from outside
      if (this.props.contextQuery.query !== this.editor.getValue()) {
        this.editor.setValue(this.props.contextQuery.query);
      }
    }

    render() {
      return (
        <ErrorBoundary name="search-bar">
          <div className={block} ref={this.props.setterRef}>
            <div ref={input => (this.input = input)} />
            <Suggestions
              searchbarWidth={this.props.width}
              eventEmitter={this.state.eventEmitter}
              onSelectSuggestion={this.onSelectSuggestion}
              config={this.state.suggestionConfig}
              searchContext={this.props.contextQuery.searchContext}
            />
          </div>
        </ErrorBoundary>
      );
    }

    onSelectSuggestion = e => {
      if (!e) {
        return;
      }

      let { string, cursorAfterInsertion } = replaceWith(
        this.props.contextQuery.query, // complete query
        e.replaceFrom, // position of the starting character of the current token
        e.replaceTo, // position of the ending character of the current token
        e.replaceWith // sequence which should be replaced with
      );

      string = trim(string);

      this.editor.setValue(string);
      this.updateQuery(string);

      // set cursor to the end of the block
      this.editor.setCursor({ line: 0, ch: cursorAfterInsertion });

      tryFocusSearch(() => (this.focusByUserClick = true));
    };

    updateQuery = newQuery => {
      if (this.editor.getValue() !== newQuery) {
        this.editor.setValue(newQuery);
      }
      setQueryInput(newQuery, this.props.contextQuery.searchContext, this.props.manageFiltersDisabled);
    };

    removeBlockFromQuery = blockId => {
      const tokens = this.editor.doc.mode.currentLexResult;
      let newQuery = '';
      for (let i = 0, length = tokens.length; i < length; i++) {
        const token = tokens[i];
        if (token.blockId !== blockId) {
          newQuery += token.lexeme;
        }
      }

      this.updateQuery(newQuery);
    };

    openSuggestionWindowOnEmptyQuery = autocompleteShownForCursorPosition => {
      const currentQuery = this.editor && this.editor.getValue();
      if (currentQuery === '' && this.editor && this.isFocused) {
        const { left } = this.editor.cursorCoords({ line: 0, ch: autocompleteShownForCursorPosition }, 'local');
        this.show({
          query: currentQuery,
          cursor: autocompleteShownForCursorPosition,
          left
        });
      }
    };

    getFieldConfig = (tokens, cursor) => {
      const changedToken = getTokenForColumn(tokens, cursor);

      // handle auto completion for field values
      const previousToken = tokens[tokens.indexOf(changedToken) - 1];
      const previousPreviousToken = tokens[tokens.indexOf(previousToken) - 1];
      const startingFieldedValue =
        changedToken && changedToken.token === 'fieldSeparator' && previousToken && previousToken.token === 'field';
      const inFieldedValue =
        changedToken &&
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
    };

    hide = () => {
      this.setState({ suggestionConfig: null });
    };

    show = suggestionConfig => {
      this.setState({ suggestionConfig });
    };

    state = {
      eventEmitter: new RoEmitter(this.id),
      suggestionConfig: null
    };
  }
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

export function trim(str) {
  return str.trimLeft().replace(/\s\s+/g, ' ');
}

export default function Input(props) {
  const { ref, ...dimensions } = useResizeObserverCustom();
  // Note: this is a bit hacky but there is no other way to make this work for this component.
  // Also we can not use the name refSetter, which is often used in ui-client, because connectTo overwrites refSetter internally.
  // Since we eventually want to get rid of DFQ anyways, it should be OK to handle ref setting this way.
  return <SearchBarInput {...props} {...dimensions} resizeObserverRef={ref} />;
}
