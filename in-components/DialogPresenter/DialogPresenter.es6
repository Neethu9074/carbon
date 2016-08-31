import {activeDialog$} from 'in-components/DialogPresenter/store';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  activeDialog: activeDialog$
}, function DialogPresenter({activeDialog}) {
  return activeDialog;
});
