const express = require('express');
const app = express();

const funcionCategorias = require("./getProductos");
const juntarDatos = require('./juntar');
const todoJunto = require('./juntartodo');
app.listen(3623, () => {
    console.log("Server online")
});

app.get("/categoria/:id", funcionCategorias.getProductosFromCategoriaId);
app.get("/juntar", juntarDatos.juntarDatos);
app.get("/juntartodo", todoJunto.juntarDatos);