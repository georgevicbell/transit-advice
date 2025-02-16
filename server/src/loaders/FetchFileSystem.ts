
import * as unzipit from "unzipit";

const unzipIt = async (url: string) => {
  const z1 = await (await fetch(url)).arrayBuffer();
  const { entries } = await unzipit.unzip(z1);
  return entries;
};
type CacheFile = { file: string; cache: string };
export const fetchCachedZip = async (
  url: string,
  files: CacheFile[]
): Promise<(string | undefined)[]> => {
  const result: (string | undefined)[] = [];
  for (var i = 0; i < files.length; i++) {
    result[i] = undefined;
  }

  console.log("Getting zip file");
  const entries = await unzipIt(url);
  for await (const file of files) {
    const entry = entries[file.file];
    if (entry) {
      result[files.findIndex((z) => z.file == file.file)] =
        await entry.text();
    }
  }
  return result;
};
