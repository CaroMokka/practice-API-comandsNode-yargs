import {promises as fs} from "fs"
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);



export const fsReadFile = async (pathUrl) => {
  const contentTxt = await fs.readFile(`${__dirname}/${pathUrl}`, "utf-8");
  const contentJS = JSON.parse(contentTxt);
  return contentJS;
};
// files/pokemons.txt

