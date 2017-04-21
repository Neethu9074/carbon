import issueCriticalIcon from 'in-components/timeline/icons/issue_critical.svg';
import issueWarningIcon from 'in-components/timeline/icons/issue_warning.svg';
import incidentIcon from 'in-components/timeline/icons/incident.svg';
import { hexToRGB } from 'in-services/formatters/color';
import { getColorBySeverity } from 'in-stores/events';

const icons = {};
export default icons;

icons.incidentImage = loadImage(incidentIcon, loadedImage => {
  icons.incidentWarningImageColored = createColorCanvasFrom(loadedImage, hexToRGB(getColorBySeverity(5)));
  icons.incidentCriticalImageColored = createColorCanvasFrom(loadedImage, hexToRGB(getColorBySeverity(10)));
});

icons.issueWarningImage = loadImage(
  issueWarningIcon,
  loadedImage => icons.issueWarningImageColored = createColorCanvasFrom(loadedImage, hexToRGB(getColorBySeverity(5)))
);
icons.issueCriticalImage = loadImage(
  issueCriticalIcon,
  loadedImage => icons.issueCriticalImageColored = createColorCanvasFrom(loadedImage, hexToRGB(getColorBySeverity(10)))
);

function loadImage(src, callback) {
  const image = document.createElement('img');
  image.onload = () => {
    if (callback) {
      callback(image);
    }
  };
  image.src = src;
  return image;
}

function createColorCanvasFrom(src, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const dim = 32;
  canvas.width = dim;
  canvas.height = dim;

  ctx.drawImage(src, 0, 0, dim, dim);

  const imageData = ctx.getImageData(0, 0, dim, dim);
  const pixels = imageData.data;

  ctx.clearRect(0, 0, dim, dim);
  for (let i = 0, numPixels = pixels.length; i < numPixels; i++) {
    const cursor = i * 4;
    pixels[cursor] = color.r;
    pixels[cursor + 1] = color.g;
    pixels[cursor + 2] = color.b;
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}
