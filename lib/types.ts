export type AudioTrack = {
  id?: string;
  title?: string;
  year?: string;
  author?: string;
  description?: string;
  audioSourceUrl?: string;
  imageSourceUrl?: string;
  archivePageUrl?: string;
};

export type Metadata = {
  metadata?: {
    identifier?: string;
    title?: string;
    year?: string;
    description?: string;
    creator?: string;
  };
  files?: File[];
};

export type File = {
  name?: string;
  format?: string;
};
