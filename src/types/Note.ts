export interface UploadedFile {
  name: string;
  type: string;
  data: Blob;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  files: UploadedFile[];
}