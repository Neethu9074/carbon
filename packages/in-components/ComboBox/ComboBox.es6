import Select from 'react-select';
import React from 'react';
import 'react-select/dist/react-select.css';

import autoMenuDirection from './autoMenuDirection';
import './DropDownDirection.less';
import './ComboBox.less';

export default autoMenuDirection(function ComboBox(props) {
  return <Select {...props} />;
});
