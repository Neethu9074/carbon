import React from 'react';

import NewApplication from 'in-applications/Forms/NewApplication/NewApplication';

export default {
  title: 'Templates|forms/NewApplication',
  component: NewApplication
};

export function DefaultStory() {
  return <NewApplication timeconfig={{}} />;
}
