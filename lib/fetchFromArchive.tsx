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

function getRandomCollection(): string {
  const randomIndex: number = Math.floor(Math.random() * collections.length);
  return collections[randomIndex];
}

async function getItemId() {}
async function getFileList(itemId: string) {}
function getSource(fileList: string[], itemId: string) {}

export { getRandomCollection };
