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
  content.applyStateMutation(currentContent => {
    if (!currentContent) {
      return _content;
    }

    if (currentContent.title === _content.title &&
        currentContent.data === _content.data) {
      return null;
    }

    return _content;
  });
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
