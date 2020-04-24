import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

export default {
  title: 'Molecules|Errors'
};

export function ErrorsStory() {
  return (
    <>
      <h2>Erroneous Result Presenter single message</h2>
      <ErroneousResultPresenter errors={[{ message: 'A backend error occured' }]} />

      <h2>Erroneous Result Presenter multi messages</h2>
      <ErroneousResultPresenter
        errors={[{ message: 'A backend error occured' }, { message: 'This is another error message' }]}
      />

      <h2>No Data available default</h2>
      <NoDataAvailable width={400} height={100} />

      <h2>No Data available small</h2>
      <NoDataAvailable width={72} height={24} />
    </>
  );
}
