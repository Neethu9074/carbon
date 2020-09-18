import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

export default {
  title: 'Molecules/Errors'
};

export function SingleMessage() {
  return <ErroneousResultPresenter errors={[{ message: 'A backend error occured' }]} />;
}

export function MultipleMessage() {
  return (
    <ErroneousResultPresenter
      errors={[{ message: 'A backend error occured' }, { message: 'This is another error message' }]}
    />
  );
}

export function NoData() {
  return <NoDataAvailable width={400} height={100} />;
}

export function NoDataSmall() {
  return <NoDataAvailable width={72} height={24} />;
}
