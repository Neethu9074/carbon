import { pull } from 'lodash';
import React from 'react';

import DropdownButton from 'in-new-components/MultiSelectDropdown/components/DropdownButton';
import DropdownList from 'in-new-components/MultiSelectDropdown/components/DropdownList';
import { isInsideOf } from 'in-services/util/dom';

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
      this.setState({ selectedValues: this.props.values || [] });
    }
  };

  clickOutsideDropdown = target => {
    return (
      !isInsideOf(target, this.dropdownListRef ? this.dropdownListRef.domElement : null) &&
      !isInsideOf(target, this.dropdownButtonRef.domElement)
    );
  };

  render() {
    const { className, placeholder = '', options = [], labelRenderer = null } = this.props;
    const { isOpen, selectedValues } = this.state;

    return (
      <div className={locals.dropdown}>
        <DropdownButton
          className={className}
          placeholder={placeholder}
          toggle={this.toggle}
          ref={element => (this.dropdownButtonRef = element)}
        />

        {isOpen ? (
          <DropdownList
            options={options}
            selectedValues={selectedValues}
            labelRenderer={labelRenderer}
            handleOptionChange={this.handleOptionChange}
            handleSelectAllClick={this.handleSelectAllClick}
            handleSetClick={this.handleSetClick}
            ref={element => (this.dropdownListRef = element)}
          />
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
