'use strict';

const fs = require('fs');

var xl = require('excel4node');


let devolverData = (req, res) => {
    let rawdata = fs.readFileSync('resultadosCrawler.json');
    let categoriasConProductos = JSON.parse(rawdata);

    var wb = new xl.Workbook();


    categoriasConProductos.map((categoria) => {


        var precioStyle = wb.createStyle({
            numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        let ws = wb.addWorksheet(categoria.categoria.nombre);
        ws.cell(1, 1).string("Nombre del producto")
            .style({
                font: {
                    bold: true,
                    color: "#006666"
                }
            });
        ws.cell(1, 2).string("Precio Mínimo")
            .style({
                font: {
                    bold: true,
                    color: "#B1002C"
                }
            });;

        ws.cell(1, 3).string("Precio Máximo")
            .style({
                font: {
                    bold: true,
                    color: "#9C1B2C"
                }
            });;;
        ws.cell(1, 4).string("Presentación");

        ws.cell(1, 5).string("Identificador único");
        categoria.productos.map((producto, index) => {
            index += 1;
            ws.column(1).setWidth(50);
            ws.column(2).setWidth(15);
            ws.column(3).setWidth(15);
            ws.column(5).setWidth(15);
            ws.column(4).setWidth(20);
            ws.cell(index + 1, 1)
                .string(producto.nombre)
                .style({
                    font: {
                        color: '#00CDCD',
                        size: 12,
                    },
                })
            ws.cell(index + 1, 2)
                .number(producto.precioMin)
                .style({
                    numberFormat: '$#,##0.00; ($#,##0.00); -',
                    font: {
                        color: "#B1002C"
                    }
                })
            ws.cell(index + 1, 3)
                .number(producto.precioMax)
                .style({
                    numberFormat: '$#,##0.00; ($#,##0.00); -',
                    font: {
                        color: "#9C1B2C"
                    }
                })
            ws.cell(index + 1, 4)
                .string(producto.presentacion)
            ws.cell(index + 1, 5)
                .string(producto.id)

        })
    })


    wb.write('Excel.xlsx');


    res.send(categoriasConProductos);
}

module.exports = { devolverData };