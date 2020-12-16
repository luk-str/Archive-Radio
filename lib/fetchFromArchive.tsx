import axios from "axios";

const searchPagesRange: number = 100;
const resultsAmount: number = 10;

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

type FetchedItem = {
  identifier: string;
  title?: string;
  year?: string;
  creator?: string | string[];
  description?: string;
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

async function getNewAudioTrack(): Promise<AudioTrack> {
  const item: FetchedItem = await fetchRandomItem();

  const id = item.identifier;
  const title = item.title;
  const year = item.year;
  const description = item.description;
  const author = item.creator
    ? Array.isArray(item.creator)
      ? item.creator[0]
      : item.creator
    : "";

  const fileList: object[] = await fetchFileList(id);

  const audioFile: File = fileList.find(
    (file: File) => file.format === "VBR MP3"
  );
  const audioSourceUrl = `https://archive.org/download/${item.identifier}/${audioFile?.name}`;

  const imageFile: File = fileList.find(
    (file: File) => file.format === "Item Image"
  );
  const imageSourceUrl = `https://archive.org/download/${item.identifier}/${imageFile?.name}`;

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

async function fetchRandomItem(): Promise<FetchedItem> {
  return axios
    .get(getSearchUrl())
    .then((response) => response.data.response.docs[0])
    .catch((err) => {
      console.log(err);
      getNewAudioTrack();
    });
}

async function fetchFileList(itemId: string): Promise<File[]> {
  return axios
    .get(`https://archive.org/metadata/${itemId}`)
    .then((response) => response.data.files)
    .catch((err) => {
      console.log(err);
      getNewAudioTrack();
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

export { getNewAudioTrack };
