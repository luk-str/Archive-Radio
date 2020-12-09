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

async function getNewAudioTrack() {
  const item = await fetchRandomItem();
  const fileList = await fetchFileList(item.identifier);
  const audioFile = fileList.find((file: {}) => file.format === "VBR MP3");
  const audioSourceUrl = `https://archive.org/download/${item.identifier}/${audioFile.name}`;

  return audioSourceUrl;
}

function fetchRandomItem(): {} {
  return axios
    .get(getSearchUrl())
    .then((response) => response.data.response.docs[0])
    .catch((err) => console.log(err));
}

function fetchFileList(itemId: string) {
  return axios
    .get(`https://archive.org/metadata/${itemId}`)
    .then((response) => response.data.files)
    .catch((err) => console.log(err));
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

// async function getFileList(itemId: string) {}
// function getSource(fileList: string[], itemId: string) {}

export { getNewAudioTrack };
