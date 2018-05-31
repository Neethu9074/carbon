import React from 'react';

import OptionRow from 'in-new-components/MultiSelectDropdown/components/OptionRow';
import Button from 'in-new-components/Button';

import locals from './DropdownList.mless';

export default class DropdownList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      options,
      selectedValues,
      labelRenderer,
      handleOptionChange,
      handleSelectAllClick,
      handleSetClick
    } = this.props;

    return (
      <div className={locals.dropdownList} ref={element => (this.domElement = element)}>
        <div className={locals.rowWrapper}>
          {options.map(option => (
            <OptionRow
              key={option.value}
              value={option.value}
              label={option.label}
              labelRenderer={labelRenderer}
              checked={selectedValues.indexOf(option.value) >= 0}
              onChange={handleOptionChange}
            />
          ))}
        </div>
        <Button kind="subtle" size="compact" className={locals.selectAllButton} onClick={handleSelectAllClick}>
          Select All
        </Button>
        <Button kind="action" size="compact" className={locals.setButton} onClick={handleSetClick}>
          Set
        </Button>
      </div>
    );
  }
}
