import { compose, withProps } from 'recompose';

import SharingDialogPresenter from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialogPresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { getUsersAsResultObservable } from 'in-api/users';
import { deepCopy } from 'in-services/util/object';
import connectTo from 'in-hoc/connectTo';
import { user } from 'in-stores/user';

export default compose(
  connectTo({
    usersResult: getUsersAsResultObservable()
  }),
  withPropDependingState({
    getInitialState,

    resets: [
      {
        getResettingProps: () => ['config'],
        onReset: getInitialState
      }
    ],

    reducerName: 'setState'
  }),
  withProps(({ setState, accessRules, onSubmit, selectedUserId }) => ({
    isPrivate: isPrivate(accessRules),
    setPrivate: prvt => setPrivate(prvt, accessRules, setState),
    setSelectedUserId: selectedUserId => setState({ selectedUserId }),
    addEditor: () => addEditor(accessRules, setState, selectedUserId),
    removeEditor: userId => removeEditor(accessRules, setState, userId),
    onSubmit: e => {
      e.preventDefault();
      close();
      onSubmit(accessRules);
    }
  }))
)(SharingDialogPresenter);

function getInitialState({ config }) {
  return {
    accessRules: config.accessRules,
    selectedUserId: ''
  };
}

function isPrivate(accessRules) {
  return !accessRules.some(({ relationType }) => relationType === 'GLOBAL');
}

function setPrivate(prvt, accessRules, setState) {
  accessRules = deepCopy(accessRules);

  if (prvt) {
    // Remove everything but this user's access
    accessRules = accessRules.filter(({ relatedId, relationType }) => relatedId === user.id && relationType === 'USER');
  } else {
    accessRules.push({
      accessType: 'READ',
      relationType: 'GLOBAL',
      relatedId: ''
    });
  }

  setState({
    accessRules,
    selectedUserId: ''
  });
}

function addEditor(accessRules, setState, selectedUserId) {
  accessRules = deepCopy(accessRules);

  accessRules.push({
    accessType: 'READ_WRITE',
    relationType: 'USER',
    relatedId: selectedUserId
  });

  setState({
    accessRules,
    selectedUserId: ''
  });
}

function removeEditor(accessRules, setState, userId) {
  setState({
    accessRules: accessRules.filter(({ relationType, relatedId }) => relationType !== 'USER' || relatedId !== userId)
  });
}
