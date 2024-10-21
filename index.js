import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import axios from "axios"
import { promises as fs } from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"
import clc from "cli-color"

const URL_BASE = "https://pokeapi.co/api/v2/"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

yargs(hideBin(process.argv))
    .command(
        "registrar",
        "Comando para registrar datos de un pokemón",
        {
            id: {
                alias: "r",
                describe: "Identificador único para registrar un pokemón",
                demandOption: true,
                type: "number"
            }
        },
        async ({ id }) => {

            try {
                const { data } = await axios.get(`${URL_BASE}/pokemon/${id}`)

                const contentTxt = await fs.readFile(`${__dirname}/files/pokemons.txt`, "utf-8")
                const contentJS = JSON.parse(contentTxt)

                const busqueda = contentJS.find( (item) => item.id === data.id )
                if(busqueda) return console.log(clc.red("Pokemón ya registrado"))

                contentJS.push(data)

                fs.writeFile(`${__dirname}/files/pokemons.txt`, JSON.stringify(contentJS), "utf-8")
                console.log(clc.green("Pokemón registrado con éxito"))
            } catch(err) {
                console.log(err)
            }
        }
    )
.help().argv

//Requerimiento de pokemón ==> name, height, weight