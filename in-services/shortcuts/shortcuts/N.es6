import {toggleControl} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';


export default function onPressed() {
  toggleControl(CONTROL_TYPES.NOTIFICATIONS);
}
