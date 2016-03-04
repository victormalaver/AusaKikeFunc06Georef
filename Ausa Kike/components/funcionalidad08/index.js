'use strict';

app.funcionalidad08 = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
});

function FechaActual(){
    var dt = new Date();
    var mes = dt.getMonth() + 1;
    var dia = dt.getDate();
    if (dia < 10) {
        dia = '0' + dia
    }
    if (mes < 10) {
        mes = '0' + mes
    }
    var ano = dt.getFullYear();
    
    var Fecha_Actual=ano + "/" + mes + "/" + dia + " ";
    return Fecha_Actual;
}
function FechaServidor(fecha){
    var fecha = fecha.replace(/-/g, "/");
    var fecha = fecha.replace(/T/g, " ");
    return fecha;
}
function FechaDispositivo(fecha){
    var fecha = fecha.replace(/\//g, "-");
    var fecha = fecha.replace(/ /g, "T");
    return fecha;
}

function CargaAlertas() {
    /*
    var Actual=FechaActual();
    alert(Actual);
    */
    
    var dtAlertas; 
    $.ajax({
        
        url: WServ + "Alertas/AlertaListar",
        type: "GET",
        data: {
            usuario: "0",
            fechaInicio: "2016/01/01 00:00:00",
            fechaFin: "2016/03/01 23:59:59",
            bitEliminado: "0"
        },
        async: false,
        success: function (datos) {
            console.log(1);
            for (var i = 0; i < datos.length; i++) { 
                datos[i].Cantidad = parseInt(i+1);
            }  
            dtAlertas = new kendo.data.DataSource({
              data: datos
            });    
        },
        error: function () {
            console.log("error ds alertas");
        }
    }); 
    
    $("#grillaSOL").kendoGrid({
        dataSource: dtAlertas,
        pageable: false, 
        selectable: "row",
        change: llamadaDatos,
        columns: [
            {
                field: "Cantidad",
                title: "No.",
                width: "10%"
            },
            {
                field: "Alertas",
                title: "Alertas",
                width: "90%"
            }]
    });

}

function llamadaDatos() {
    window.location.href = "#detalleAlertas";
    var grid = $("#grillaSOL").data("kendoGrid");

    var seleccion = grid.select();
    /*
    console.log("datos seleccionados: " + this.dataItem(seleccion).ale_int_id);
    console.log("datos seleccionados: " + this.dataItem(seleccion).Alertas);
    console.log("datos seleccionados: " + this.dataItem(seleccion).Cantidad);
    */
    var Actual=FechaActual();
    var Dispositivo=FechaDispositivo(Actual);

    var bitId = this.dataItem(seleccion).ale_int_id;
    console.log(bitId);
    $('#bitId').val(bitId);
    var fechaInicio = Actual + "00:00:00";
    var fechaFin = Actual + "23:59:59";

    
    var fecha_Inicio = Dispositivo + "00:00:00";
    var fecha_Fin = Dispositivo + "23:59:59";
    
    //console.log(fecha_Inicio + " " + fecha_Fin);
    
    $('#fechaInicio').val(fecha_Inicio);
    $('#fechaFin').val(fecha_Fin);
 
    $("#bitEliminado").kendoDropDownList({
        //cascadeFrom: "ContactosCliente",
        dataTextField: "parentName",
        dataValueField: "parentId",
        dataSource: [
            {
                parentName: "Pendiente",
                parentId: 0
            },
            {
                parentName: "Cerrado",
                parentId: 1
            }
    ]
    });

    var bitEliminado = "0";
    //JsonDetalle(fechaInicio, fechaFin, bitEliminado, bitId);

}

function JsonDetalle() {
    /*
    var fecha_Inicio = fechaInicio.replace(/-/g, "/");
    var fecha_Fin = fechaFin.replace(/-/g, "/");
    $('#conso').html(fecha_Inicio+" "+fecha_Fin);
    $('#conso2').val(fecha_Inicio+" "+fecha_Fin);
    console.log(fecha_Inicio+" "+fecha_Fin);
    //$('#fechaInicio').val(fecha_Inicio);
    //$('#fechaFin').val(fecha_Fin);
    */
    var fechaInicio = $('#fechaInicio').val();
    var fechaInicio = FechaServidor(fechaInicio);
    
    var fechaFin = $('#fechaFin').val();
    var fechaFin = FechaServidor(fechaFin);
    
    var dtAlertaDetalle = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Alertas/AlertaListarDetalle",
                dataType: "json",
                type: "get",
                data: {
                    usuario: "0",
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    bitEliminado: $('#bitEliminado').val(),
                    bitId: $('#bitId').val()
                }
            }
        },
        pageSize: 8
    });
    gridDetalle(dtAlertaDetalle);
}

function llamadaFiltro() {

    var bitId = $('#bitId').val();
    
    var fechaInicio = $('#fechaInicio').val();
    var fechaInicio = FechaServidor(fechaInicio);
    
    var fechaFin = $('#fechaFin').val();
    var fechaFin = FechaServidor(fechaFin);
    
    var bitEliminado = $('#bitEliminado').val();

    console.log(bitId + " " + fechaInicio + " " + fechaFin + " " + bitEliminado);
    JsonDetalle();
}


function gridDetalle(dtAlertaDetalle) {
    //console.log(dtAlertaDetalle);
    $("#grillaSOLDetalle").kendoGrid({
        dataSource: dtAlertaDetalle,
        pageable: true,
        selectable: "row",
        filterable: true,
        //change: llamadaDatos,
        sortable: true,
        columns: [
            {
                field: "bana_int_id",
                title: "No.",
                width: "5px",
                filterable: false
            },
            {
                field: "Cliente",
                title: "Cliente",
                width: "50px",
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contiene",
                            eq: "Es igual a",
                            neq: "No es igual a"
                        }
                    },
                    messages: {
                        info: "Filtrar por cliente: ",
                        filter: "Filtrar",
                        clear: "Limpiar"
                    }
                }
            },
            {
                field: "Orden",
                title: "Orden",
                width: "25px",
                filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contiene",
                                eq: "Es igual a",
                                neq: "No es igual a"
                            }
                        },
                        messages: {
                            info: "Filtrar por Orden: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    }
            },
            {
                field: "Fecha",
                title: "Hora de envío",
                width: "25px",
                filterable: false
            },
            {
                field: "Prioridad",
                title: "Prioridad",
                width: "15px",
                template: '#if(Prioridad=="V"){#<div style="margin: auto;border-radius:50%;background:green;width:20px;height:20px"></div>#}else if(Prioridad=="R"){#<div style="margin: auto;border-radius:50%;background:red;width:20px;height:20px"></div>#}else if(Prioridad=="N"){#<div style="margin: auto;border-radius:50%;background:orange;width:20px;height:20px"></div>#}#',
            	filterable: false
            },
            {
                field: "Estado",
                title: "Estado",
                width: "20px",
                filterable: false
            }
        ]
    });
}