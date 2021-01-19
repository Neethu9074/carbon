/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { scrollIntoView } from 'in-services/util/dom';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Row.mless';

const allowedKeyCodesForKeydown = [keyCodes.arrows.up, keyCodes.arrows.down, keyCodes.space];

const expand = <SvgIcon type="lib_arrow_expand_down" className={locals.toggle} />;
const collapse = <SvgIcon type="lib_arrow_expand_up" className={locals.toggle} />;

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
    if (selected) {
      locals.tableRow += ' ' + locals.selectedRow;
    }

    if (isInteractive) {
      locals.tableRow += ' ' + locals.clickableRow;
    }

    return (
      <tr
        className={row.expanded ? locals.expandedRow : locals.tableRow}
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
