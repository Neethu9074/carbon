import React from 'react';
import { pull } from 'lodash';

import OptionRow from 'in-new-components/MultiSelectDropdown/OptionRow';
import { findParentNodeByClassName } from 'in-services/util/dom';

import locals from './MultiSelectDropdown.mless';

export default class MultiSelectDropdown extends React.Component {
  static displayName = 'MultiSelectDropdown';

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedValues: []
    };
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  close = () => this.setState({ isOpen: false });

  componentDidMount() {
    window.addEventListener('click', this.handleMouseClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleMouseClick);
  }

  handleMouseClick = e => {
    if (this.clickOutsideDropdown(e.target)) {
      this.close();
    }
  };

  clickOutsideDropdown = target => {
    return findParentNodeByClassName(target, locals.dropdown) == null;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.values) {
      this.setState({
        selectedValues: nextProps.values
      });
    }
  }

  render() {
    const { placeholder = '', options = [], labelRenderer = null } = this.props;
    const { isOpen, selectedValues } = this.state;

    return (
      <div className={locals.dropdown}>
        <button className={locals.button} onClick={() => this.toggle()}>
          {placeholder}
        </button>
        {isOpen ? (
          <div className={locals.dropdownList}>
            {options.map(option => (
              <OptionRow
                key={option.value}
                value={option.value}
                label={option.label}
                labelRenderer={labelRenderer}
                checked={selectedValues.indexOf(option.value) >= 0}
                onChange={this.handleOptionChange}
              />
            ))}
            <button className={locals.button} onClick={this.handleSelectAllClick}>
              Select All
            </button>
            <button className={locals.button} onClick={this.handleSetClick}>
              Set
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  handleOptionChange = (value, selected) => {
    const { selectedValues } = this.state;

    if (selected && selectedValues.indexOf(value) < 0) {
      this.setState({
        selectedValues: selectedValues.concat([value])
      });
    }

    if (!selected && selectedValues.indexOf(value) >= 0) {
      this.setState({
        selectedValues: pull(selectedValues, value)
      });
    }
  };

  handleSelectAllClick = () => {
    this.setState({
      selectedValues: this.props.options.map(option => option.value)
    });
  };

  handleSetClick = () => {
    this.close();
    this.props.apply(this.state.selectedValues);
  };
}
