import { asBlob } from "html-docx-js-typescript";
// if you want to save the docx file, you need import 'file-saver'
import { saveAs } from "file-saver";

export function saveDocx(htmlString) {
  asBlob(htmlString).then((data) => {
    saveAs(data, "file.docx"); // save as docx file
  }); // asBlob() return Promise<Blob|Buffer>
}
