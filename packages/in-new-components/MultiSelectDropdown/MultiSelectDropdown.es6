import React from 'react';
import { pull } from 'lodash';

import OptionRow from 'in-new-components/MultiSelectDropdown/OptionRow';
import { findParentNodeByClassName } from 'in-services/util/dom';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MultiSelectDropdown.mless';

export default class MultiSelectDropdown extends React.Component {
  static displayName = 'MultiSelectDropdown';

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedValues: props.values ? props.values : []
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
    return (
      findParentNodeByClassName(target, locals.dropdownList) == null &&
      findParentNodeByClassName(target, locals.dropdownButton) == null
    );
  };

  render() {
    const { placeholder = '', options = [], labelRenderer = null } = this.props;
    const { isOpen, selectedValues } = this.state;

    return (
      <div className={locals.dropdown}>
        <button className={locals.dropdownButton} onClick={() => this.toggle()}>
          {placeholder}
          <SvgIcon width={16} height={16} type="lib_arrow_drop_down" />
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
            <Button kind="subtle" size="compact" className={locals.selectAllButton} onClick={this.handleSelectAllClick}>
              Select All
            </Button>
            <Button kind="action" size="compact" className={locals.setButton} onClick={this.handleSetClick}>
              Set
            </Button>
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
