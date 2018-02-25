import React from 'react';

import Overlay from 'in-new-components/overlays/Overlay';
import Input from 'in-components/form/Input';

// import locals from './DateInput.mless';

export default function DatePicker() {
  return <Overlay content={DatePickerOverlay}>{({ open }) => <Input type="text" onFocus={open} />}</Overlay>;
}

function DatePickerOverlay() {
  return <div style={{ background: 'red' }}>FOobar</div>;
}
