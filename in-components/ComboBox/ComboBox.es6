import Select from 'react-select';
import React from 'react';

import 'react-select/dist/react-select.css';
import './ComboBox.less';

export default function ComboBox(props) {
  return <Select {...props} />;
}
