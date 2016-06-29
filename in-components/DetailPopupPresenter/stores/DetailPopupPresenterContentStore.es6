import {createStore} from 'in-stores/store';


const content = createStore({
  name: 'DetailPopupPresenter/ContentStore',
  initialValue: null
});
export const content$ = content.observable;

export function setContent(_content) {
  content.applyStateMutation(() => _content);
}

export function toggleContent(_content) {
  content$.once(_currentContent => _currentContent ? clearContent() : setContent(_content));
}

export function clearContent() {
  setContent(null);
  setContentFilter(null);
}

const contentFilter = createStore({
  name: 'DetailPopupPresenter/ContentFilterStore',
  initialValue: null
});
export const contentFilter$ = contentFilter.observable;

export function setContentFilter(_filter) {
  contentFilter.applyStateMutation(() => _filter);
}
