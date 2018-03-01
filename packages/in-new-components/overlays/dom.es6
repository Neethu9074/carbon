import { overlayClassName } from 'in-new-components/overlays/OverlayPresenter/SingleOverlayPresenter';

export function identifyOverlay(node) {
  while (node != null && node !== document) {
    if (node.classList.contains(overlayClassName)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}
