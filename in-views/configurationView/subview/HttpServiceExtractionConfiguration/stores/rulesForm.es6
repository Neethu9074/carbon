import {ListForm, MapForm, Field} from 'in-services/form';
import {generateUniqueShortId} from 'in-services/util/id';
import {createStore} from 'in-stores/store';

const rulesFormStore = createStore({
  name: 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/rulesForm',
  initialValue: new ListForm()
});
export const rulesForm$ = rulesFormStore.observable;


export function addNewRule(id) {
  const ruleForm = new MapForm()
    .addItem('id', new Field(id || generateUniqueShortId()))
    .addItem('name', new Field('New Service Rule'))
    .addItem('enabled', new Field(false))
    .addItem('comment', new Field(''))
    .addItem('matchSpecification', new MapForm(atLeastOneMatchSpecificationRule))
    .addItem('label', new Field('Unnamed service'));

  rulesFormStore.applyStateMutation(rulesForm => rulesForm.addItem(ruleForm));
}


export function addMatchSpecification(path, initialValue) {
  rulesFormStore.applyStateMutation(rulesForm => {
    return rulesForm.addItem(path, new Field(initialValue, matchSpecificationMustCompileRule));
  });
}


function atLeastOneMatchSpecificationRule(mapForm) {
  if (mapForm.keys().length === 0) {
    return 'At least one match expression is required.';
  }
  return null;
}


export function matchSpecificationMustCompileRule(regex) {
  try {
    /* eslint-disable no-new */
    new RegExp(regex);
    /* eslint-enable no-new */
    return null;
  } catch (e) {
    return e.message;
  }
}
