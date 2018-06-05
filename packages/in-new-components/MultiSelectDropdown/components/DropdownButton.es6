import React from 'react';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

export default function DropdownButton({ className, placeholder, toggle }) {
  return (
    <Button kind="secondary" size="compact" className={className} onClick={() => toggle()}>
      {placeholder}
      <SvgIcon width={16} height={16} type="lib_arrow_drop_down" />
    </Button>
  );
}
