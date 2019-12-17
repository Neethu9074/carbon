import React from 'react';

import Badge from 'in-new-components/Badge/Badge';

export default {
  title: 'Components/Badge',
  component: Badge
};

export const bold = () => <Badge>bold</Badge>;
export const light = () => <Badge kind="light">light</Badge>;
export const inverted = () => <Badge kind="inverted">inverted</Badge>;
