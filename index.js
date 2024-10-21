import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import axios from "axios";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import clc from "cli-color";

const URL_BASE = "https://pokeapi.co/api/v2/";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Pokemon {
  constructor(id, name, height, weight, experience, type) {
    (this.poke_id = id),
      (this.poke_name = name),
      (this.poke_height = height),
      (this.poke_weight = weight),
      (this.poke_experience = experience),
      (this.poke_type = type);
  }
}

yargs(hideBin(process.argv))
  .command(
    "registrar",
    "Comando para registrar datos de un pokemón",
    {
      id: {
        alias: "r",
        describe: "Identificador único para registrar un pokemón",
        demandOption: true,
        type: "number",
      },
    },
    async ({ id }) => {
      try {
        const { data } = await axios.get(`${URL_BASE}/pokemon/${id}`);

        const contentTxt = await fs.readFile(
          `${__dirname}/files/pokemons.txt`,
          "utf-8"
        );
        const contentJS = JSON.parse(contentTxt);

        const busqueda = contentJS.find((item) => item.id === data.id);
        if (busqueda) return console.log(clc.red("Pokemón ya registrado"));

        contentJS.push(data);

        fs.writeFile(
          `${__dirname}/files/pokemons.txt`,
          JSON.stringify(contentJS),
          "utf-8"
        );
        console.log(clc.green("Pokemón registrado con éxito"));
      } catch (err) {
        console.log(err);
      }
    }
  )
  .command(
    "listar",
    "Comando para listar pokemones registrados",
    {},
    async () => {
      try {
        const contentTxt = await fs.readFile(
          `${__dirname}/files/pokemons.txt`,
          "utf-8"
        );
        const contentJS = JSON.parse(contentTxt);

        const listPokemons = contentJS.map((item) => {
          return new Pokemon(
            item.id,
            item.name,
            item.height,
            item.weight,
            item.base_experience,
            item.types[0].type.name
          );
        });

        console.log(clc.bgGreen("Lista actualizada"), listPokemons);
        fs.writeFile(
          `${__dirname}/files/list-pokemons.txt`,
          JSON.stringify(listPokemons),
          "utf-8"
        );
      } catch (err) {
        console.error(clc.red("Error al procesar los archivos"), err);
      }
    }
  )
  .help().argv;
