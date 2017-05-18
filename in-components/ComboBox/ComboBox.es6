import Select from 'react-select';
import React from 'react';

import 'react-select/dist/react-select.css';
import './ComboBox.less';

export default function ComboBox({ name, options, value, onChange, className }) {
  return <Select name={name} value={value} options={options} onChange={onChange} className={className} />;
}
