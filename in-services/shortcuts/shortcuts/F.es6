import {toggle} from 'in-stores/search/expanded';


export default function onPressed(e) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return;
  }

  e.preventDefault();
  toggle();
}
