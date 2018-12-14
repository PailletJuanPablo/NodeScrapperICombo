var fs = require('fs');
var xl = require('excel4node');
const superMamiId = 1;
const hiperLibertadId = 16;
const cordiezId = 7;
const juntarDatos = async(req, res) => {
    const datos01 = await readData('01');
    const datos02 = await readData('02');
    const datos03 = await readData('03');
    const datos04 = await readData('04');
    const datos05 = await readData('05');
    const datos06 = await readData('06');
    const datos07 = await readData('07');
    const datos08 = await readData('08');

    let resultados = [];

    resultados.push(datos01);
    resultados.push(datos02);
    resultados.push(datos03);
    resultados.push(datos04);
    resultados.push(datos05);
    resultados.push(datos06);
    resultados.push(datos07);
    resultados.push(datos08);
    let resultadosSoloProductos = [];
    resultados.map((resultado) => {
        resultadosSoloProductos.push(resultado.productos);
    })
    var wb = new xl.Workbook();


    let ws = wb.addWorksheet('Todo junto');
    ws.cell(1, 1).string("Nombre del producto")
        .style({
            font: {
                bold: true,
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
        });
    ws.cell(1, 4).string("Presentación");
    ws.cell(1, 5).string("Min Mami");
    ws.cell(1, 6).string("Min Libertad");
    ws.cell(1, 7).string("Min  Cordiez");
    ws.column(1).setWidth(50);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(15);
    ws.row(1).setHeight(20);

    count = 0;
    resultadosSoloProductos.map((element) => {

        element.map((producto, index) => {
            count += 1;

            ws.cell(count, 1)
                .string(producto.producto.nombre)
                .style({
                    font: {
                        size: 12,
                        bold: true
                    },
                })
            ws.cell(count, 2)
                .number(producto.producto.precioMin)
                .style({
                    numberFormat: '$#,##0.00; ($#,##0.00); -',
                    font: {
                        color: "#B1002C"
                    }
                })
            ws.cell(count, 3)
                .number(producto.producto.precioMax)
                .style({
                    numberFormat: '$#,##0.00; ($#,##0.00); -',
                    font: {
                        color: "#9C1B2C"
                    }
                })
            ws.cell(count, 4)
                .string(producto.producto.presentacion)


            const estiloMasBarato = wb.createStyle({
                numberFormat: '$#,##0.00; ($#,##0.00); -',
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#72D7F4',
                    fgColor: '#72D7F4',
                }
            });



            producto.sucursales.map((sucursal) => {

                if (sucursal.comercioId == superMamiId && sucursal.preciosProducto && sucursal.preciosProducto) {
                    console.log(sucursal.preciosProducto.precioLista);
                    if (producto.producto.precioMin == sucursal.preciosProducto.precioLista) {
                        ws.cell(count, 5)
                            .number(sucursal.preciosProducto.precioLista)
                            .style(estiloMasBarato)
                    } else {
                        ws.cell(count, 5)
                            .number(sucursal.preciosProducto.precioLista)
                            .style({
                                numberFormat: '$#,##0.00; ($#,##0.00); -',
                                font: {
                                    color: "#9C1B2C"
                                }
                            })
                    }

                }

                if (sucursal.comercioId == hiperLibertadId && sucursal.preciosProducto) {
                    if (producto.producto.precioMin == sucursal.preciosProducto.precioLista) {
                        ws.cell(count, 6)
                            .number(sucursal.preciosProducto.precioLista)
                            .style(estiloMasBarato)
                    } else {
                        ws.cell(count, 6)
                            .number(sucursal.preciosProducto.precioLista)
                            .style({
                                numberFormat: '$#,##0.00; ($#,##0.00); -',
                                font: {
                                    color: "#9C1B2C"
                                }
                            })
                    }
                }

                if (sucursal.comercioId == cordiezId && sucursal.preciosProducto) {
                    if (producto.producto.precioMin == sucursal.preciosProducto.precioLista) {
                        ws.cell(count, 7)
                            .number(sucursal.preciosProducto.precioLista)
                            .style(estiloMasBarato)
                    } else {
                        ws.cell(count, 7)
                            .number(sucursal.preciosProducto.precioLista)
                            .style({
                                numberFormat: '$#,##0.00; ($#,##0.00); -',
                                font: {
                                    color: "#9C1B2C"
                                }
                            })
                    }
                }



            })
        })
    })


    wb.write('TodoJunto.xlsx');

    return res.send(resultados);


}

const readData = async(categoriaId) => {
    return new Promise((resolve, reject) => {
        const data = JSON.parse(fs.readFileSync('resultados/' + categoriaId + '.json', 'utf8'));
        resolve(data);
    });
}

module.exports = { juntarDatos }