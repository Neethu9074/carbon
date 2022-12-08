/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

export default function download(fileType: string, ref: string) {
  let extension = '';

  switch (fileType) {
    case 'HAR':
      extension = '.json.gz';
      break;

    case 'IMAGES':
      extension = '.tar';
      break;

    case 'VIDEOS':
      extension = '.tar';
      break;

    case 'LOGS':
      extension = '.tgz';
      break;
  }

  let fileName: string = fileType.toLowerCase();
  const a: HTMLAnchorElement = document.body.appendChild(document.createElement('a'));

  a.download = fileName + extension;
  a.href = ref;
  a.click();

  // clean up 'a' element & remove ObjectURL
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
