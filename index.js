import fs from 'fs';
import path from 'path';

const source = path.join('./', 'assets');

const readdir = folder => new Promise((resolve, reject) => {
  fs.readdir(folder, (error, fileNames) => {
    if (error) {
      reject(error);
    }
    resolve(fileNames);
  });
});

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      reject(error);
    }
    resolve(data);
  });
});

const writeFile = (filePath, data) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, data, 'utf8', (error) => {
    if (error) {
      reject(error);
    }
    resolve();
  });
});

const main = async () => {
  const data = await readdir(source)
    .then(names => names.map(name => path.join(source, name)))
    .then(names => Promise.all(names.map(name => readFile(name).then(JSON.parse))))
    .then(names => names.filter(({ TipoAmbitoPantalla }) => TipoAmbitoPantalla === 6));
    // .then(names => writeFile(path.join('./', 'output.json'), JSON.stringify(names, null, 2)));

  const partidos = data.reduce((lista, provincia) => {
    const { ListaPartidos } = provincia;

    return lista.concat(ListaPartidos);
  }, [])
    .map(party => ({
      id: party.CodigoPartido,
      initials: party.SiglasPartido,
      name: party.NombrePartido,
      color: party.ColorHexa,
      prevId: party.CodigoPartidoAnterior,
      prevInitials: party.SiglasPartidoAnterior,
      prevName: party.NombrePartidoAnterior,
      prevColor: party.ColorHexaAnterior,
    }))
    .filter((party, idx, total) => idx === total.findIndex(({ id }) => party.id === id));

  console.log(partidos, partidos.length);
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });
