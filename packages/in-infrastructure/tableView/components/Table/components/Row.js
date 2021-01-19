/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { scrollIntoView } from 'in-services/util/dom';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import './Row.less';

const allowedKeyCodesForKeydown = [keyCodes.arrows.up, keyCodes.arrows.down, keyCodes.space];

const block = 'in-table-row';
const selectedRow = `${block}--selected`;
const clickableRow = `${block}--clickable`;

const expand = <SvgIcon className={`${block}__toggle`} type="lib_openclose_add_circle_outline" size="xs" />;
const collapse = <SvgIcon className={`${block}__toggle`} type="lib_openclose_remove_circle_outline" size="xs" />;

export default class Row extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.lastRowKey !== nextProps.row.key || this.lastMutationCount !== nextProps.row.mutationCount;
  }

  render() {
    const { row, selected, toggleRowDetails, cellClassName } = this.props;
    this.lastRowKey = row.key;
    this.lastMutationCount = row.mutationCount;

    const isInteractive = this.props.onClick;

    let rowClasses = block;

    if (selected) {
      rowClasses += ' ' + selectedRow;
    }

    if (isInteractive) {
      rowClasses += ' ' + clickableRow;
    }

    return (
      <tr
        className={rowClasses}
        ref={this.setDomRef}
        tabIndex={10000}
        onKeyDown={this.onKeyDown}
        onClick={this.onClick}
      >
        {toggleRowDetails ? (
          <td className={cellClassName} onClick={() => toggleRowDetails(row.key)}>
            {row.expanded ? collapse : expand}
          </td>
        ) : null}

        {row.columns.map((column, i) => {
          const style = column.columnDefinition.cellStyle || {};
          if (selected && i === 0) {
            style.paddingLeft = '0.25rem';
          }
          return (
            <td key={i} className={cellClassName} style={style}>
              {column.content}
            </td>
          );
        })}
      </tr>
    );
  }

  onKeyDown = e => {
    if (
      e.target === this.domElement &&
      !keyCodes.isModifierPressed(e) &&
      allowedKeyCodesForKeydown.indexOf(e.keyCode) !== -1
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (this.props.onClick) {
      //do this only if no other click listener is registered to not confuse multi select tables
      return;
    }

    if (e.keyCode === keyCodes.arrows.up) {
      this.moveActiveState(-1);
    } else if (e.keyCode === keyCodes.arrows.down) {
      this.moveActiveState(1);
    } else if (e.keyCode === keyCodes.space) {
      this.props.toggleRowDetails(this.props.row.key);
    }
  };

  moveActiveState(direction) {
    const elements = Array.prototype.slice
      .call(this.domElement.parentNode.childNodes)
      .filter(element => element.tabIndex > 0);
    const newActiveElementIndex = Math.min(
      elements.length - 1,
      Math.max(0, elements.indexOf(this.domElement) + direction)
    );
    elements[newActiveElementIndex].focus();
    scrollIntoView(elements[newActiveElementIndex]);
  }

  setDomRef = domElement => {
    this.domElement = domElement;
  };

  onClick(e) {
    if (!this.props.onClick) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.props.onClick(this.props.row.rowConfig, e, this.props.rowIndex);
  }
}
