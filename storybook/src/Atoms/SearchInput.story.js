import React, { useState } from 'react';

import SearchInput from 'in-new-components/SearchInput';

export default {
  title: 'Atoms/FormControl/SearchInput',
  component: SearchInput
};

export const Default = () => {
  const [value, setValue] = useState('');
  return <SearchInput onChange={setValue} query={value} maxWidth={200} />;
};
