import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './DropdownButton.mless';

export default class DropdownButton extends React.Component {
  constructor(props) {
    super(props);

    this.domElement == null;
    this.setDomElement = element => {
      this.domElement = element;
    };
  }

  render() {
    const { className, placeholder, toggle } = this.props;

    return (
      <button className={`${className} ${locals.dropdownButton}`} onClick={() => toggle()} ref={this.setDomElement}>
        {placeholder}
        <SvgIcon width={16} height={16} type="lib_arrow_drop_down" />
      </button>
    );
  }
}
