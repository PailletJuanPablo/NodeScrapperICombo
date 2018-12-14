const express = require('express');
const app = express();
var proxy = require('http-proxy-middleware');
var fs = require('fs');

const baseUrl = 'https://d3e6htiiul5ek9.cloudfront.net/'
const productosUrl = 'prod/productos'
const arraySucursales =
    '7-1-40,9-2-444,10-3-648,16-2-4104,9-1-440,9-2-435,10-3-610,16-2-5204,10-3-607,9-2-441,10-3-642,9-1-476,10-3-641,16-2-5404,10-3-606,9-1-434,16-2-4804,9-2-439,16-2-5104,10-3-644,1-1-4,16-1-202,9-1-473,1-1-2,9-2-33,9-2-451,7-1-8,9-1-455,9-1-472,7-2-803'

const categoriasUrl = 'https://d3e6htiiul5ek9.cloudfront.net/prod/categorias'
let listaCategorias = []
const AsyncAF = require('async-af')

const baseProductosUrl = 'https://d3e6htiiul5ek9.cloudfront.net/prod/productos?'
    /*
    https://d3e6htiiul5ek9.cloudfront.net/prod/productos?&id_categoria=01&array_sucursales=7-1-40,9-2-444,10-3-648,16-2-4104,9-1-440,9-2-435,10-3-610,16-2-5204,10-3-607,9-2-441,10-3-642,9-1-476,10-3-641,16-2-5404,10-3-606,9-1-434,16-2-4804,9-2-439,16-2-5104,10-3-644,1-1-4,16-1-202,9-1-473,1-1-2,9-2-33,9-2-451,7-1-8,9-1-455,9-1-472,7-2-803&offset=0&limit=500&sort=-cant_sucursales_disponible
    */
const listaProductosUrl = `${baseUrl}${productosUrl}?&id_categoria=01&array_sucursales=${arraySucursales}&offset=0&limit=500&sort=-cant_sucursales_disponible`
const axios = require('axios');

const excel = require("./excel");

const port = 9999;

let categoriasConProductos = [];
let infoProductos = [];

// Load the full build.
var _ = require('lodash')

let listener = (req, res) => {
    console.log('Server online')
}
app.listen(port, listener())

let response = async(req, res) => {
    await getCategorias()
        // En este punto tengo todas las categorías filtradas

    await listByCategoria()
        // En este punto tengo un conjunto de productos por categoria

    // await getProductosBasedOnCategoriasConProductos();
    var encoding = "utf8";

    //res.send(categoriasConProductos)

    var filepath = "resultadosCrawler.txt";

    fs.writeFile(filepath, JSON.stringify(categoriasConProductos), (err) => {
        if (err) throw err;

        console.log("The file was succesfully saved!");
    });

    let categoriaBebes = categoriasConProductos[2];
    getProductosInfoPorCategoria(categoriaBebes.productos).then(() => {
        console.log("Done");
        res.send(infoProductos)
    })

    fs.writeFile("resultados2.txt", JSON.stringify(infoProductos), (err) => {
        if (err) throw err;

        console.log("The file was succesfully saved!");
    });

    // console.log(categoriasConProductos);
}

let getCategorias = async(req, res) => {
    let resultado
    try {
        resultado = await axios.get(categoriasUrl)
    } catch (error) {
        console.error(error)
    }

    resultado.data.categorias.forEach(categoria => {
        listaCategorias.push(categoria)
    })

    filteredCategorias = listaCategorias.filter(categoria => {
        return categoria.nivel < 2
    })

    listaCategorias = filteredCategorias
}

let getProductosByCategoryId = async categoria => {
    let resultado

    const productosPorCategoriaUrl = `${baseProductosUrl}&id_categoria=${
    categoria.id
  }&array_sucursales=${arraySucursales}&offset=0&limit=50`
    try {
        resultado = await axios.get(productosPorCategoriaUrl)
    } catch (error) {
        console.error(error)
    }

    let listadoProductosPorCategoria = []
    resultado.data.productos.forEach(producto => {
        listadoProductosPorCategoria.push(producto)
    })

    categoriasConProductos.push({
        categoria,
        productos: listadoProductosPorCategoria
    })
}

let listByCategoria = async() => {
    let lenght = listaCategorias.length
    let count = 0
    return new Promise((resolve, reject) => {
        AsyncAF(listaCategorias).forEach(async(categoria, index) => {
            await getProductosByCategoryId(categoria)
            count += 1
            if (count == lenght) {
                resolve(true)
            }
        })
    })
}

let getProductosBasedOnCategoriasConProductos = async() => {

    let count = 0;
    let lenght = categoriasConProductos.lenght;

    return new Promise((resolve, reject) => {

        categoriasConProductos.map(async(categoriaItem) => {
            await getProductosInfoPorCategoria(categoriaItem.productos);
            count += 1;
            if (count == lenght) {
                resolve(true)
            };
        });
    })

}

let getProductosInfoPorCategoria = async productosCategoria => {
    let count = 0;
    let lenght = productosCategoria.lenght;

    return new Promise((resolve, reject) => {
        AsyncAF(productosCategoria).forEach(async(producto, index) => {
            console.log("Escanenado..." + index);

            let infoProducto = await getProductoInfo(producto.id);

            fs.appendFile('resultado_alcohol.json', JSON.stringify(infoProducto), function(err) {
                if (err) console.log(err);
                console.log('Guardado', index);
                console.log("Count", count)
            });



            infoProductos.push(infoProducto);
            count += 1;
            if (count == 50) {
                resolve(true)
            }
        })
    })
}

let getProductoInfo = async productoId => {
    const url =
        'https://d3e6htiiul5ek9.cloudfront.net/prod/producto?limit=30&id_producto=' + productoId + '&array_sucursales=' +
        arraySucursales
    try {
        resultado = await axios.get(url)
    } catch (error) {
        console.error(error)
    }
    return resultado.data;
}

app.get('/', response)

app.get("/excel", excel.devolverData);