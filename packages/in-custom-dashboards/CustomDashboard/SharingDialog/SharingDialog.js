import { compose, withProps } from 'recompose';

import SharingDialogPresenter from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialogPresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { deepCopy } from 'in-services/util/object';

export default compose(
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['config'],
        onReset: getInitialState
      }
    ],

    reducerName: 'setAccessRules',
    reducer: (prevState, accessRules) => ({
      ...prevState,
      accessRules
    })
  }),
  withProps(({ accessRules, setAccessRules, onSubmit }) => ({
    isPrivate: isPrivate(accessRules),
    setPrivate: prvt => setPrivate(prvt, accessRules, setAccessRules),
    onSubmit: e => {
      e.preventDefault();
      close();
      onSubmit(accessRules);
    }
  }))
)(SharingDialogPresenter);

function getInitialState({ config }) {
  return {
    accessRules: config.accessRules
  };
}

function isPrivate(accessRules) {
  return !accessRules.some(({ relationType }) => relationType === 'GLOBAL');
}

function setPrivate(prvt, accessRules, setAccessRules) {
  accessRules = deepCopy(accessRules);

  // Remove existing flag
  accessRules = accessRules.filter(({ relationType }) => relationType !== 'GLOBAL');

  // Re-add if necessary
  if (!prvt) {
    accessRules.push({
      accessType: 'READ',
      relationType: 'GLOBAL',
      relatedId: ''
    });
  }

  setAccessRules(accessRules);
}
