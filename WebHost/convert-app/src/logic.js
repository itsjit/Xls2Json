import { toast } from 'react-toastify';
import i18n from './i18n';

const hasResult = result => (result ? true : false);
const hasFile = selectedFile => (selectedFile ? true : false);
const getFileName = selectedFile => (selectedFile ? selectedFile.name : '');
const getResultFileName = (selectedFile, result) =>
  hasResult(result) && hasFile(selectedFile) ? `${selectedFile.name}.json` : '';
const getResultJson = result => (result ? JSON.stringify(result, null, 2) : '');
const getResultJsonToDisplay = result => (result ? JSON.stringify(result, null, 2) : '');
const getResultHref = result =>
  result ? 'data:text/plain;charset=utf-8,' + encodeURIComponent(getResultJson(result)) : '';
const copyToClipboard = result => navigator.clipboard.writeText(getResultJsonToDisplay(result));

const checkFileCount = event => {
  let files = event.target.files;
  if (files.length > 1) {
    const msg = i18n.t('Only 1 file can be uploaded at a time');
    event.target.value = null;
    toast.warn(msg);
    return false;
  }
  return true;
};
const checkFileSize = event => {
  let files = event.target.files;
  let size = 2000000;
  let err = [];
  for (var x = 0; x < files.length; x++) {
    if (files[x].size > size) {
      err[x] = i18n.t('{{ filename }} is too large, please pick a smaller file\n', { filename: files[x].name });
    }
  }
  for (var z = 0; z < err.length; z++) {
    toast.error(err[z]);
    event.target.value = null;
  }
  return true;
};

export default {
  hasResult,
  getFileName,
  getResultFileName,
  getResultJsonToDisplay,
  getResultHref,
  copyToClipboard,
  checkFileCount,
  checkFileSize
};
