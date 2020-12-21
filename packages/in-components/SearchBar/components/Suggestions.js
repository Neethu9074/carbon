import React from 'react';

import {
  lex,
  getTokenForColumn,
  isTerm,
  isField,
  isFieldSeparator,
  isOperator,
  isWhitespace
} from 'in-stores/search/lexer';
import { getSubstringTillDotBackwards, getCursorTillNextDot } from 'in-components/SearchBar/misc/stringUtils';
import { findNode, operatorTree, getValueSuggestions, node as createNode } from 'in-stores/search/fields';
import classNames from 'classnames';
import { emptyArray } from 'in-services/fixedObjects';
import keyCodes from 'in-components/keyCodes';

import './Suggestions.less';

const block = 'in-search-suggestions';

export default class extends React.Component {
  static displayName = 'Suggestion';

  state = {
    currentHighlightedRowIndex: 0,
    availableChildren: getChildrenForConfig(this.props.searchContext, this.props.config)
  };

  componentDidMount() {
    this.setupSubscriptions();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    // jump to first entry if the list changes
    if (this.props.config !== nextProps.config) {
      this.setState({
        currentHighlightedRowIndex: 0,
        availableChildren: getChildrenForConfig(this.props.searchContext, nextProps.config)
      });
    }
  }

  componentWillunmount = () => {
    this.disposeSubscriptions();
  };

  render() {
    const { config, searchbarWidth } = this.props;
    const { availableChildren, currentHighlightedRowIndex } = this.state;
    if (!config || availableChildren.length === 0) {
      return null;
    }

    // suggestions window has 30rem in width, so the max x postion is full width - 16 * 30 (480);
    const left = Math.min(config.left, searchbarWidth - 396);
    const scrollElement = document.querySelector('.in-search-suggestions');

    return (
      <div className={block} style={{ left }}>
        <ul className={`${block}__list`}>
          {availableChildren.map((child, i) => (
            <li
              className={classNames({
                [`${block}__item`]: true,
                [`${block}__item--selected`]: i === currentHighlightedRowIndex
              })}
              key={child.name}
              onClick={() => this.onReturn(child)}
              ref={item => {
                if (i === currentHighlightedRowIndex && item && scrollElement) {
                  const topYPosOfItem = item.offsetTop;
                  const bottomYPosOfItem = item.offsetTop + item.offsetHeight;
                  const currentYPosOfScrollElement = scrollElement.scrollTop + scrollElement.clientHeight;
                  if (bottomYPosOfItem > currentYPosOfScrollElement) {
                    const delta = bottomYPosOfItem - currentYPosOfScrollElement;
                    scrollElement.scrollTop += delta + 6; // add a margin
                  } else if (topYPosOfItem < scrollElement.scrollTop) {
                    const delta = scrollElement.scrollTop - topYPosOfItem;
                    scrollElement.scrollTop -= delta + 6; // add a margin
                  }
                }
              }}
            >
              <span className={`${block}__label`}>{child.name}</span>
              <TermType node={child} />
              <div className={`${block}__description`}>{child.description}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  setupSubscriptions = () => {
    this.keyDownSubscription = this.props.eventEmitter.on('keyDown').subscribe(keyCode => {
      if (keyCode === keyCodes.arrows.down) {
        this.onArrowDown();
      } else if (keyCode === keyCodes.arrows.up) {
        this.onArrowUp();
      } else if (keyCode === keyCodes.return || keyCode === keyCodes.tab) {
        this.onReturn();
      }
    });
  };

  disposeSubscriptions = () => {
    if (this.keyDownSubscription) {
      this.keyDownSubscription.dispose();
      this.keyDownSubscription = null;
    }
    if (this.blurSubscription) {
      this.blurSubscription.dispose();
      this.blurSubscription = null;
    }
  };

  onArrowDown = () => {
    const numItems = this.state.availableChildren.length;
    this.setState({
      currentHighlightedRowIndex: (this.state.currentHighlightedRowIndex + 1) % numItems
    });
  };

  onArrowUp = () => {
    if (this.state.currentHighlightedRowIndex === 0) {
      const numItems = this.state.availableChildren.length;
      this.setState({
        currentHighlightedRowIndex: numItems - 1
      });
    } else {
      this.setState({
        currentHighlightedRowIndex: this.state.currentHighlightedRowIndex - 1
      });
    }
  };

  onReturn = child => {
    const { config, onSelectSuggestion } = this.props;
    const { availableChildren, currentHighlightedRowIndex } = this.state;
    if (!config || this.state.availableChildren.length === 0) {
      return;
    }

    // a child can be given if the user clicks, or it can be calculated via current index if using the keyboard
    child = child || availableChildren[currentHighlightedRowIndex];

    const changedToken = getTokenForConfig(config);
    const cursorRelativeToToken = config.cursor - changedToken.start;
    const cursorTillEndOfTokenPart = getCursorTillNextDot(changedToken.lexeme, cursorRelativeToToken);
    const completePartToBeReplaced = getSubstringTillDotBackwards(changedToken.lexeme, cursorTillEndOfTokenPart).trim();

    const nextToken = getTokenForConfig({
      query: config.query,
      cursor: changedToken.end + 1
    });

    let replaceWith;
    let replaceFrom;
    let replaceTo = changedToken.end; // default: delete all what comes after the change in this current token

    if (isFieldSeparator(changedToken)) {
      replaceWith = `${child.query} `;
      replaceFrom = changedToken.start + 1;
      if (nextToken) {
        replaceTo = nextToken.end;
      }
    } else if (child.isPreset) {
      // if a preset was choosen, replace the whole term with the presets definition (query)
      replaceWith = `${child.query} `;
      replaceFrom = changedToken.start;
    } else {
      replaceFrom = -completePartToBeReplaced.length + cursorTillEndOfTokenPart + changedToken.start; // relative -> absolute
      replaceWith = child.query;
      // if the selected suggestion is a leaf, append an fieldSeperator symbol (:), but only if it doesn't exist
      if (child.children.length === 0 && (!nextToken || !isFieldSeparator(nextToken))) {
        replaceWith += ':';
      } else if (child.children.length > 0) {
        replaceWith += '.';
      } else {
        replaceWith += ' ';
      }
    }

    onSelectSuggestion({
      replaceFrom,
      replaceTo,
      replaceWith
    });
  };
}

function TermType({ node }) {
  if (!node.termType) {
    return null;
  }

  return <span className={`${block}__term-type`}>{node.termType}</span>;
}

function getChildrenForConfig(searchContext, config) {
  if (!config) {
    return emptyArray;
  }

  const tokenAtCursor = getTokenForConfig(config);

  if (config.field) {
    let cappedValueAtCursor = config.fieldValue;
    if (tokenAtCursor && config.cursor - tokenAtCursor.start >= 0) {
      cappedValueAtCursor = config.fieldValue.substr(0, config.cursor - tokenAtCursor.start);
    }
    return getValueSuggestions(config.field, cappedValueAtCursor, searchContext).map(field =>
      createNode(field, { isPreset: true })
    );
  }

  if (
    !tokenAtCursor ||
    (!isOperator(tokenAtCursor) && !isTerm(tokenAtCursor) && !isField(tokenAtCursor) && !isWhitespace(tokenAtCursor))
  ) {
    return emptyArray;
  }

  if (isWhitespace(tokenAtCursor)) {
    return findNode(undefined, searchContext).children;
  } else if (isOperator(tokenAtCursor)) {
    return operatorTree.children;
  }

  const cappedLexemeAtCursor = tokenAtCursor.lexeme.substr(0, config.cursor - tokenAtCursor.start);
  const node = findNode(cappedLexemeAtCursor, searchContext);
  if (!node) {
    return emptyArray;
  }

  const lastPartOfCurrentTerm = getSubstringTillDotBackwards(cappedLexemeAtCursor).trim();
  return node.children
    .filter(child => child.name.indexOf(lastPartOfCurrentTerm) >= 0)
    .filter(child => child.termType !== 'id'); // hide ID suggestions
}

function getTokenForConfig({ query, cursor }) {
  return getTokenForColumn(lex(query), cursor - 1); // exclusive
}
