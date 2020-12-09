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

type Item = {
  identifier?: string;
};
type File = {
  format?: string;
};
type AudioFile = {
  name?: string;
  format?: string;
};

async function getNewAudioTrack(): Promise<string> {
  console.log("Loading new track...");

  const item: Item = await fetchRandomItem();

  const fileList: object[] = await fetchFileList(item.identifier);
  const audioFile: AudioFile = fileList.find(
    (file: File) => file.format === "VBR MP3"
  );

  const audioSourceUrl = `https://archive.org/download/${item.identifier}/${audioFile.name}`;

  console.log("Track loaded!");

  return audioSourceUrl;
}

async function fetchRandomItem(): Promise<Item> {
  return axios
    .get(getSearchUrl())
    .then((response) => response.data.response.docs[0])
    .catch((err) => {
      console.log(err);
      getNewAudioTrack();
    });
}

async function fetchFileList(itemId: string): Promise<object[]> {
  return axios
    .get(`https://archive.org/metadata/${itemId}`)
    .then((response) => response.data.files)
    .catch((err) => {
      console.log(err);
      getNewAudioTrack();
    });
}

function getSearchUrl(): string {
  return `https://archive.org/advancedsearch.php?q=collection:(${getRandomCollection()})+AND+mediatype:(audio)&sort[]=__random+desc&sort[]=&sort[]=&rows=${resultsAmount}&page=${getRandomPageNumber()}&output=json`;
}

function getRandomCollection(): string {
  return collections[Math.floor(Math.random() * collections.length)];
}

function getRandomPageNumber(): number {
  return Math.floor(Math.random() * searchPagesRange);
}

export { getNewAudioTrack };
