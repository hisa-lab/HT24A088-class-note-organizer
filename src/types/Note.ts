export interface UploadedFile {
  name: string;
  type: string;
  data: Blob;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  subject: string;
  lectureNo: number;
  important: boolean;

  files: UploadedFile[];

  createdAt: number;
}