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
import { findNode, operatorTree } from 'in-stores/search/fields';
import { evaluateClassNames } from 'in-services/util/classnames';
import { emptyArray } from 'in-services/fixedObjects';
import keyCodes from 'in-components/keyCodes';

import './Suggestions.less';

const block = 'in-search-suggestions';

export default React.createClass({
  displayName: 'Suggestion',

  getInitialState() {
    return {
      currentHighlightedRowIndex: 0,
      availableChildren: getChildrenForConfig(this.props.config)
    };
  },

  componentDidMount() {
    this.setupSubscriptions();
  },

  componentWillUpdate(nextProps) {
    // jump to first entry if the list changes
    if (this.props.config !== nextProps.config) {
      this.setState({
        currentHighlightedRowIndex: 0,
        availableChildren: getChildrenForConfig(nextProps.config)
      });
    }
  },

  componentWillunmount() {
    this.disposeSubscriptions();
  },

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
              className={evaluateClassNames({
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
              {child.name}
              <TermType node={child} />
              <span className={`${block}__description`}>
                {this.getNodeDescription(child)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  },

  getNodeDescription(child) {
    if (child.children.length > 0) {
      return child.children.length > 0 && child.description
        ? `${child.description} - (${child.children.length})`
        : `(${child.children.length})`;
    }
    return child.description;
  },

  setupSubscriptions() {
    this.keyDownSubscription = this.props.eventEmitter.on('keyDown').subscribe(keyCode => {
      if (keyCode === keyCodes.arrows.down) {
        this.onArrowDown();
      } else if (keyCode === keyCodes.arrows.up) {
        this.onArrowUp();
      } else if (keyCode === keyCodes.return) {
        this.onReturn();
      }
    });

    // TODO: make this better
    this.blurSubscription = this.props.eventEmitter
      .on('blur')
      .throttle(200, { leading: false })
      .subscribe(() => this.props.onClose());
  },

  disposeSubscriptions() {
    if (this.keyDownSubscription) {
      this.keyDownSubscription.dispose();
      this.keyDownSubscription = null;
    }
    if (this.blurSubscription) {
      this.blurSubscription.dispose();
      this.blurSubscription = null;
    }
  },

  onArrowDown() {
    this.setState({
      currentHighlightedRowIndex: Math.min(
        this.state.availableChildren.length - 1,
        this.state.currentHighlightedRowIndex + 1
      )
    });
  },

  onArrowUp() {
    this.setState({
      currentHighlightedRowIndex: Math.max(0, this.state.currentHighlightedRowIndex - 1)
    });
  },

  onReturn(child) {
    const config = this.props.config;
    if (!config || this.state.availableChildren.length === 0) {
      return;
    }

    // a child can be given if the user clicks, or it can be calculated via current index if using the keyboard
    child = child || this.state.availableChildren[this.state.currentHighlightedRowIndex];

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
    const replaceTo = changedToken.end; // always delete all what comes after the change in this current token

    // if a preset was choosen, replace the whole term with the presets definition (query)
    if (child.isPreset) {
      replaceWith = `${child.query} `;
      replaceFrom = changedToken.start;
    } else {
      replaceFrom = -completePartToBeReplaced.length + cursorTillEndOfTokenPart + changedToken.start; // relative -> absolute
      replaceWith = child.query;
      // if the selected suggestion is a leaf, append an fieldSeperator symbol (:), but only if it doesn't exist
      if (child.children.length === 0 && (!nextToken || !isFieldSeparator(nextToken))) {
        replaceWith += ':';
      }
    }

    this.props.onSelectSuggestion({
      replaceFrom,
      replaceTo,
      replaceWith
    });
  }
});

function TermType({node}) {
  const termType = (node.termType && (node.termType === 'string' || node.termType === 'long'))
    ? node.termType
    : null;
  if (!termType) {
    return null;
  }

  return (
    <span className={`${block}__term-type`}>
      {termType}
    </span>
  );
}

function getChildrenForConfig(config) {
  if (!config) {
    return emptyArray;
  }

  const tokenAtCursor = getTokenForConfig(config);
  if (
    !tokenAtCursor ||
    (!isOperator(tokenAtCursor) && !isTerm(tokenAtCursor) && !isField(tokenAtCursor) && !isWhitespace(tokenAtCursor))
  ) {
    return emptyArray;
  }

  if (isWhitespace(tokenAtCursor)) {
    return findNode().children;
  } else if (isOperator(tokenAtCursor)) {
    return operatorTree.children;
  }

  const cappedLexemeAtCursor = tokenAtCursor.lexeme.substr(0, config.cursor - tokenAtCursor.start);
  const node = findNode(cappedLexemeAtCursor);
  if (!node) {
    return emptyArray;
  }

  const lastPartOfCurrentTerm = getSubstringTillDotBackwards(cappedLexemeAtCursor).trim();
  return node.children.filter(child => child.name.startsWith(lastPartOfCurrentTerm));
}

function getTokenForConfig(config) {
  return getTokenForColumn(lex(config.query), config.cursor - 1); // exclusive
}
