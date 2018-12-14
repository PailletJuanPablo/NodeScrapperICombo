const express = require('express');
const app = express();
var proxy = require('http-proxy-middleware');
var fs = require('fs');
var _ = require('lodash');
const arraySucursales =
    '7-1-40,9-2-444,10-3-648,16-2-4104,9-1-440,9-2-435,10-3-610,16-2-5204,10-3-607,9-2-441,10-3-642,9-1-476,10-3-641,16-2-5404,10-3-606,9-1-434,16-2-4804,9-2-439,16-2-5104,10-3-644,1-1-4,16-1-202,9-1-473,1-1-2,9-2-33,9-2-451,7-1-8,9-1-455,9-1-472,7-2-803'
categoriaConProductos = {};
const AsyncAF = require('async-af')
const baseProductosUrl = 'https://d3e6htiiul5ek9.cloudfront.net/prod/productos?'
const axios = require('axios');


// Local Data
let categoryData;
/* "nivel": 4,
"categoriaRequerida": true,
"nombre": null,
"productos": 40,
"id": "061001001"
*/

const getProductosFromCategoriaId = async(req, res) => {
    // Get category id
    const categoriaId = req.params.id;
    // Get category name
    getCategoryName(categoriaId);
    // Se almacena en la variable CategoryData
    console.log("Obteniendo de " + categoryData.nombre);
    await getProductosByCategoryId(categoriaId);
    await writeProducts();
    let actualData = JSON.parse(fs.readFileSync(`resultados/${categoryData.id}.json`, 'utf8'));
    res.send(actualData);
}

const getCategoryName = (id) => {
    const categoriesData = JSON.parse(fs.readFileSync('categorias.json', 'utf8')).categorias;
    categoryData = _.find(categoriesData, { id });
}

let getProductosByCategoryId = async categoria_id => {

    let resultado;
    const productosPorCategoriaUrl = `${baseProductosUrl}&id_categoria=${categoria_id}&array_sucursales=${arraySucursales}&offset=0&limit=150`
    try {
        resultado = await axios.get(productosPorCategoriaUrl)
    } catch (error) {
        console.error(error)
    }

    let listadoProductosPorCategoria = [];
    let count = 0;

    return new Promise((resolve, reject) => {
        const length = resultado.data.productos.length;
        AsyncAF(resultado.data.productos).forEach(async(producto, index) => {
            let infoProducto = await getProductoInfo(producto.id);
            count += 1;
            console.log('Guardado', index);
            console.log("length", length)
            console.log("Count", count);
            listadoProductosPorCategoria.push(infoProducto);
            if (count == length) {
                categoriaConProductos = {
                    cat: categoryData.nombre,
                    productos: listadoProductosPorCategoria
                };
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

let writeProducts = async() => {
    return new Promise((resolve, reject) => {
        fs.writeFileSync(`resultados/${categoryData.id}.json`, JSON.stringify(categoriaConProductos), { encoding: "utf8" });
        resolve();
    });

}

module.exports = { getProductosFromCategoriaId };