import axios from "axios";

const searchPagesRange: number = 100;

const collections: string[] = [
  "78rpm",
  "78rpm_bostonpubliclibrary",
  "78rpm_chomowicz_ready",
  "78rpm_mcneil",
  "78rpm_thorpe",
  "album_recordings",
  "pogonyi-cds",
  "unlockedrecordings",
];

type Metadata = {
  metadata?: {
    title?: string;
    year?: string;
    description?: string;
    creator?: string;
  };
  files?: [];
};

type AudioTrack = {
  id: string;
  title?: string;
  year?: string;
  author?: string;
  description: string;
  audioSourceUrl: string;
  imageSourceUrl: string;
  archivePageUrl: string;
};

type File = {
  name?: string;
  format?: string;
};

export async function getAudioTrack(id: string): Promise<AudioTrack> {
  const metadata = await fetchMetadata(id);

  const itemMetadata = metadata.metadata;
  const fileList = metadata.files;

  const title = itemMetadata.title;
  const year = itemMetadata.year;
  const description = itemMetadata.description;
  const author = itemMetadata.creator
    ? Array.isArray(itemMetadata.creator)
      ? itemMetadata.creator[0]
      : itemMetadata.creator
    : "";

  const audioFile: File = fileList.find(
    (file: File) => file.format === "VBR MP3"
  );
  const audioSourceUrl = `https://archive.org/download/${id}/${audioFile?.name}`;

  const imageFile: File = fileList.find(
    (file: File) => file.format === "Item Image"
  );
  const imageSourceUrl = `https://archive.org/download/${id}/${imageFile?.name}`;

  const archivePageUrl: string = `https://archive.org/details/${id}`;

  const audioTrack: AudioTrack = {
    id,
    title,
    year,
    author,
    description,
    audioSourceUrl,
    imageSourceUrl,
    archivePageUrl,
  };

  return audioTrack;
}

export async function fetchRandomItemId(): Promise<string> {
  return axios
    .get(getSearchUrl())
    .then((response) => response.data.response.docs[0].identifier)
    .catch((err) => {
      console.log(err);
      fetchRandomItemId();
    });
}

async function fetchMetadata(id: string): Promise<Metadata> {
  return axios
    .get(`https://archive.org/metadata/${id}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      fetchMetadata(id);
    });
}

function getSearchUrl(): string {
  return `https://archive.org/advancedsearch.php?q=collection:(${getRandomCollection()})+AND+mediatype:(audio)&fl[]=identifier&fl[]=creator&fl[]=title&fl[]=year&fl[]=creator&sort[]=__random+desc&rows=1&page=${getRandomPageNumber()}&output=json`;
}

function getRandomCollection(): string {
  return collections[Math.floor(Math.random() * collections.length)];
}

function getRandomPageNumber(): number {
  return Math.floor(Math.random() * searchPagesRange);
}
