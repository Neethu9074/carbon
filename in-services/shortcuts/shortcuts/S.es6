import {toggle} from 'in-stores/search/expanded';


export default function onPressed(e) {
  e.preventDefault();
  toggle();
}
