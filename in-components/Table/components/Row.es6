import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import keyCodes from 'in-components/keyCodes';

import './Row.less';

const block = 'in-table-row';
const selectedRow = `${block}--selected`;
const clickableRow = `${block}--clickable`;

const expand = <SvgIcon type="timeline_open" width={12} className={`${block}__toggle`} />;
const collapse = <SvgIcon type="timeline_close" width={12} className={`${block}__toggle`} />;

export default class Row extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.state = {
      active: false
    };
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

        {this.props.row.columns.map((column, i) => (
          <td key={i} className={this.props.cellClassName} style={column.columnDefinition.cellStyle}>
            {column.content}
          </td>
        ))}
      </tr>
    );
  }

  onKeyDown = e => {
    e.stopPropagation();
    e.preventDefault();

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
    const elements = Array.prototype.slice.call(this.domElement.parentNode.childNodes);
    const newActiveElementIndex = Math.min(
      elements.length - 1,
      Math.max(0, elements.indexOf(this.domElement) + direction)
    );
    this.removeAllOtherActiveStates();
    if (elements[newActiveElementIndex].setActive) {
      elements[newActiveElementIndex].setActive(true);
      elements[newActiveElementIndex].focus();
    }
  }

  setActive = active => {
    this.setState({ active });
  };

  setDomRef = domElement => {
    this.domElement = domElement;

    // removal case
    if (domElement) {
      domElement.setActive = this.setActive;
    }
  };

  onClick(e) {
    if (!this.props.onClick) {
      //do this only if no other click listener is registered to not confuse multi select tables
      this.removeAllOtherActiveStates();
      this.setActive(true);

      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.props.onClick(this.props.row);
  }

  removeAllOtherActiveStates() {
    const children = Array.prototype.slice.call(this.domElement.parentNode.childNodes);
    for (let i = children.length - 1; i >= 0; i--) {
      if (children[i].setActive) {
        children[i].setActive(false);
      }
    }
  }
}
