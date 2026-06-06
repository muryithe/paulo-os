export interface FileItem {
  _id: string;
  name: string;
  blobUrl: string;
  type: string;
  size: number;
  folder: string;
  uploadedAt: string;
}

export interface DatasetItem {
  _id: string;
  name: string;
  description: string;
  blobUrl: string;
  rowCount: number;
  colCount: number;
  columns: { name: string; type: string }[];
  preview: Record<string, unknown>[];
  tags: string[];
  uploadedAt: string;
}

export interface NoteItem {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyPhotoItem {
  _id: string;
  blobUrl: string;
  caption: string;
  dateTaken: string;
  people: string[];
  uploadedAt: string;
}

export interface FamilyEventItem {
  _id: string;
  title: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'milestone';
  person: string;
  notes: string;
  recurring: boolean;
}

export type FolderName = 'all' | 'work' | 'knowledge-base' | 'cv-docs' | 'datasets' | 'family' | 'archive';
