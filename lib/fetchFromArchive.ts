import axios from "axios";
import type { AudioTrack, Metadata, File } from "./types";

// Search Settings
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

export function createAudioTrackObject(itemMetadata: Metadata): AudioTrack {
  const metadata = itemMetadata.metadata;
  const id = metadata.identifier;
  const fileList = itemMetadata.files;

  const author: string = Array.isArray(metadata.creator)
    ? metadata.creator[0]
    : metadata.creator || "";

  const audioFile = fileList.find((file) => file.format === "VBR MP3");
  const imageFile = fileList.find((file) => file.format === "Item Image");

  const audioSourceUrl = encodeURI(
    `https://archive.org/download/${id}/${audioFile?.name}`
  );
  const imageSourceUrl = encodeURI(
    `https://archive.org/download/${id}/${imageFile?.name}`
  );
  const archivePageUrl = encodeURI(`https://archive.org/details/${id}`);

  return {
    id,
    title: metadata.title,
    year: metadata.year,
    author,
    description: metadata.description,
    audioSourceUrl,
    imageSourceUrl,
    archivePageUrl,
  };
}

export async function getRandomItemId(): Promise<string> {
  return axios
    .get(randomSearchUrl())
    .then((response) => response.data.response.docs[0].identifier)
    .catch((err) => {
      console.log(err);
      getRandomItemId();
    });
}

export async function getItemMetadata(id: string): Promise<Metadata> {
  return axios
    .get(encodeURI(`https://archive.org/metadata/${id}`))
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
      getItemMetadata(id);
    });
}

const randomSearchUrl = () =>
  encodeURI(
    `https://archive.org/advancedsearch.php?q=collection:(${randomCollection()})+AND+mediatype:(audio)&fl[]=identifier&fl[]=creator&fl[]=title&fl[]=year&fl[]=creator&sort[]=__random+desc&rows=1&page=${randomPageNumber()}&output=json`
  );

const randomPageNumber = () => Math.floor(Math.random() * searchPagesRange);
const randomCollection = () =>
  collections[Math.floor(Math.random() * collections.length)];
