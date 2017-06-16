import React from 'react';

import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import './Row.less';

const allowedKeyCodesForKeydown = [keyCodes.arrows.up, keyCodes.arrows.down, keyCodes.space];

const block = 'in-table-row';
const selectedRow = `${block}--selected`;
const clickableRow = `${block}--clickable`;

const expand = <SvgIcon type="timeline_open" width={12} className={`${block}__toggle`} />;
const collapse = <SvgIcon type="timeline_close" width={12} className={`${block}__toggle`} />;

export default class Row extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.lastRowKey !== nextProps.row.key || this.lastMutationCount !== nextProps.row.mutationCount;
  }

  render() {
    this.lastRowKey = this.props.row.key;
    this.lastMutationCount = this.props.row.mutationCount;

    let rowClasses = `${block} ${this.props.rowClassName}`;
    if (this.props.row.selected) {
      rowClasses += ' ' + selectedRow;
    }
    if (this.props.onClick) {
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
        {this.props.toggleRowDetails
          ? <td className={this.props.cellClassName} onClick={() => this.props.toggleRowDetails(this.props.row.key)}>
              {this.props.row.expanded ? collapse : expand}
            </td>
          : null}

        {this.props.row.columns.map((column, i) =>
          <td key={i} className={this.props.cellClassName} style={column.columnDefinition.cellStyle}>
            {column.content}
          </td>
        )}
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
    scrollIntoViewIfNeeded(elements[newActiveElementIndex]);
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
    this.props.onClick(this.props.row);
  }
}
