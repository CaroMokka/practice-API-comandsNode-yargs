import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import axios from "axios";
import clc from "cli-color";
import { fsReadFile, fsWriteFile } from "./fs-dirname.js"

const URL_BASE = "https://pokeapi.co/api/v2/";

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
        const fileData = await fsReadFile("files/pokemons.txt")
        const busqueda = fileData.find((item) => item.id === data.id);
        if (busqueda) return console.log(clc.red("Pokemón ya registrado"));
        fileData.push(data);
        await fsWriteFile("files/pokemons.txt", fileData)
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
        const fileData = await fsReadFile("files/pokemons.txt")
        const listPokemons = fileData.map((item) => {
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
        await fsWriteFile("files/list-pokemons.txt", listPokemons)
      } catch (err) {
        console.error(clc.red("Error al procesar los archivos"), err);
      }
    }
  )
  .help().argv;
