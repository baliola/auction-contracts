import Parser from "smartcontract-type-binding-generator/dist/implementation/class-parser";
import Writer from "smartcontract-type-binding-generator/dist/implementation/writer";
import * as fs from "fs-extra";
import * as path from "path";

async function main() {
  const writer = new Writer();
  const parser = new Parser();
  const dir = fs.readdirSync("./build/contracts");

  for (const file of dir) {
    const name = file.split(".").shift() as string;
    const _path = path.resolve(process.cwd(), "build", "contracts", file);
    const content = JSON.parse(fs.readFileSync(_path).toString()).abi;

    const body = writer.write(name, JSON.stringify(content));
    const output = parser.parse(name, body);

    const writePath = path.resolve(
      process.cwd(),
      "test",
      "helpers",
      "bindings",
      name.concat(".js")
    );

    fs.writeFileSync(writePath, output);
  }
}
main();
