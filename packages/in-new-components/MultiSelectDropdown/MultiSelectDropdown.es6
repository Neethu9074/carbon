import { pull } from 'lodash';
import React from 'react';

import DropdownButton from 'in-new-components/MultiSelectDropdown/components/DropdownButton';
import DropdownList from 'in-new-components/MultiSelectDropdown/components/DropdownList';
import { deepCopy } from 'in-services/util/object';

export default class MultiSelectDropdown extends React.Component {
  static displayName = 'MultiSelectDropdown';

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedValues: props.values || []
    };

    this.dropdownButtonRef = null;
    this.dropdownListRef = null;

    this.setDropdownButtonRef = element => {
      this.dropdownButtonRef = element;
    };
    this.setDropdownListRef = element => {
      this.dropdownListRef = element;
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
      this.setState({
        isOpen: false,
        selectedValues: this.props.values || []
      });
    }
  };

  clickOutsideDropdown = target => {
    const isInsideOfButton = this.dropdownButtonRef ? this.dropdownButtonRef.contains(target) : false;
    const isInsideOfList = this.dropdownListRef ? this.dropdownListRef.contains(target) : false;
    return !isInsideOfButton && !isInsideOfList;
  };

  render() {
    const { className, placeholder = '', options = [], labelRenderer = null } = this.props;
    const { isOpen, selectedValues } = this.state;

    return (
      <div>
        <span ref={this.setDropdownButtonRef}>
          <DropdownButton className={className} placeholder={placeholder} toggle={this.toggle} />
        </span>

        {isOpen ? (
          <div ref={this.setDropdownListRef}>
            <DropdownList
              options={options}
              selectedValues={selectedValues}
              labelRenderer={labelRenderer}
              handleOptionChange={this.handleOptionChange}
              handleSelectAllClick={this.handleSelectAllClick}
              handleSetClick={this.handleSetClick}
            />
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
        selectedValues: pull(deepCopy(selectedValues), value)
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
