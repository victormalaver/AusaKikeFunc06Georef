'use strict';
app.funcionalidad05 = kendo.observable({
    onShow: function () {

    },
    afterShow: function () {

    },
});


var f05NumOperacion = 0;
var f05Orden = 0;

function f05FechaAtencionConsilidato() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;

    $("#f05FchAtencionConsilidato").val(today);
    f05getOperaciones($("#f05FchAtencionConsilidato").val());
} 

//getOperaciones -> cargamos el grid tareas
function f05getOperaciones(f05FchAtencionConsilidato) {
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    if (!$("#f05FchAtencionConsilidato").val()) {
        notificationWidget.show("Fecha incorrecta", "error");
        $('#f05FchAtencionConsilidato').parent().addClass("has-error");
        return;
    } else {
        $('#f05FchAtencionConsilidato').parent().removeClass("has-error");
    }

    var idSS = sessionStorage.getItem("sessionUSER");
    var f05dsOperaciones = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/Listar",
                dataType: "json",
                type: "post",
                data: {
                    txtdespachador: idSS,
                    txtcliente: 0,
                    txtorden: 0,
                    txtalmacen: 0,
                    txtestado: 9,
                    txtfecha: f05FchAtencionConsilidato, //"2015/09/24", //f05FchAtencionConsilidato,
                },
            }
        },
        schema: {
            model: {
                fields: {
                    FechaCreacionOperacion: {
                        type: "date"
                    }
                }
            }
        },
        pageSize: 10
    });

    f05dsOperaciones.fetch(function () {
        function filterMenu(e) {
            if (e.field == "FechaCreacionOperacion") {
                var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
                beginOperator.value("gte");
                beginOperator.trigger("change");
                var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
                endOperator.value("lte");
                endOperator.trigger("change");
                e.container.find(".k-dropdown").hide();
            }
        }
        if (f05dsOperaciones.total() > 0) {
            if ($("#f05operaciones").data("kendoGrid")) {
                $("#f05operaciones").data("kendoGrid").setDataSource(f05dsOperaciones);
            } else {
                $("#f05operaciones").kendoGrid({
                    dataSource: f05dsOperaciones,
                    filterable: true,
                    sortable: true,
                    pageable: true,
                    scrollable: false,
                    selectable: "row",
                    change: f05SelectGridDetOperacion,
                    filterMenuInit: filterMenu, //llamamos a la función de configuración de los filtros
                    columns: [
            //COL_1 NumOperacion
                        {
                            field: "NumOperacion",
                            title: "Id",
                            width: "40px",
                            filterable: false
            },
           //COL5 #Órden
                        {
                            field: "Orden",
                            title: "#Órden",
                            width: "120px",
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
                                    info: "Filtrar por Órden: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
            },
            //COL2 Cliente
                        {
                            field: "ClienteAlias",
                            title: "Cliente",
                            width: "120px",
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
                                    info: "Filtrar por Cliente: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
            },
            //COL3 Despachador
                        {
                            field: "Despachador",
                            title: "Despachador",
                            width: "120px",
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
                                    info: "Filtrar por Cliente: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
            },
            //COL4 Almacén
                        {
                            field: "Almacen",
                            title: "Almacén",
                            width: "120px",
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
                                    info: "Filtrar por Almacén: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
            }, 
            //COL6 Operacion
                        {
                            field: "Operacion",
                            title: "Operación",
                            width: "120px",
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
                                    info: "Filtrar por Operación: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
            },
            //COL7 Tiempo Trascurrido
                        {
                            field: "HoraFin",
                            title: "Tiempo Trascurrido",
                            width: "120px",
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
                                    info: "Filtrar por Tiempo Trascurrido: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
            },
            //COL8 Fecha de creacion
                        {
                            field: "FechaCreacionOperacion",
                            title: "Fecha de creación",
                            width: "120px",
                            format: "{0:dd/MM/yyyy}",
                            filterable: {
                                messages: {
                                    info: "Rango de creación: "
                                }
                            }
            },
                        //COL8 Estado
                        {
                            field: "Estado",
                            title: "Estado",
                            width: "120px",
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
                                    info: "Filtrar por estado: ",
                                    filter: "Filtrar",
                                    clear: "Limpiar"
                                }
                            }
                    }],
                    //dataBound -> para pintar la fila rojo (si es menor 2 dias), naranja (si es menor a 7 dias) y blanco (mayor a 7 dias) 
                    dataBound: function (e) {
                        var items = this._data;
                        var rows = e.sender.tbody.children();
                        for (var i = 0; i < rows.length; i++) {
                            var row = $(rows[i]);
                            if (i % 2 == 0) {
                                row.addClass("row-default");
                            } else {
                                row.addClass("row-alt");
                            }
                        }
                    }
                });
            }
            $("#f05operaciones").css("display", "block");
        } else {
            $("#f05operaciones").css("display", "none");
            notificationWidget.show("No se encontraron operaciones el " + f05FchAtencionConsilidato, "error");
        }
    });
}

function f05SelectGridDetOperacion() {
    var grid = $("#f05operaciones").data("kendoGrid");
    var seleccion = grid.select();

    f05Orden = this.dataItem(seleccion).Orden;
    f05NumOperacion = this.dataItem(seleccion).OperacionID;

    //INFORMACIONES DE PA /Operaciones/Listar

    if (this.dataItem(seleccion).TiempoTranscurrido) {
        $("#f05TiempoTranscurrido").text(this.dataItem(seleccion).TiempoTranscurrido + " dias. ");
    } else {
        $("#f05TiempoTranscurrido").text("N/A");
    }

    if (this.dataItem(seleccion).Operacion) {
        $("#f05Actividad").text(this.dataItem(seleccion).Operacion);
    } else {
        $("#f05Actividad").text("N/A");
    }

    if (this.dataItem(seleccion).HoraInicio) {
        $("#f05HoraInicio").text(this.dataItem(seleccion).HoraInicio);
    } else {
        $("#f05HoraInicio").text("N/A");
    }

    if (this.dataItem(seleccion).Estado) {
        $("#f05Estado").text(this.dataItem(seleccion).Estado);
    } else {
        $("#f05Estado").text("N/A");
    }

    if (this.dataItem(seleccion).FechaInicio) {
        $("#f05FechaInicio").text(this.dataItem(seleccion).FechaInicio);
    } else {
        $("#f05FechaInicio").text("N/A");
    }

    if (this.dataItem(seleccion).HoraEntrega) {
        $("#f05HoraFin").text(this.dataItem(seleccion).HoraEntrega);
    } else {
        $("#f05HoraFin").text("N/A");
    }

    if (this.dataItem(seleccion).Orden) {
        $("#f05Orden").text(this.dataItem(seleccion).Orden);
    } else {
        $("#f05Orden").text("N/A");
    }

    if (this.dataItem(seleccion).NumOperacion) {
        $("#f05NumOperacion").text(this.dataItem(seleccion).NumOperacion);
    } else {
        $("#f05NumOperacion").text("N/A");
    }

    //dsOperaciones -> obtenemos la lista de tareas
    var f05dsOperaciones = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/Detalle/" + this.dataItem(seleccion).NumOperacion, //226667
                dataType: "json",
                type: "get"
            },
        }
    });

    f05dsOperaciones.fetch(function () {
        if (f05dsOperaciones.total() > 0) {
            var data = this.data();
            var dateFechaCreacion = eval(" new " + data[0].FechaCreacion.replace(/\//g, '') + ";");
            var day = dateFechaCreacion.getDate();
            var month = dateFechaCreacion.getMonth() + 1;
            var year = dateFechaCreacion.getFullYear();
            $("#f05FechaCreacion").text(day + "/" + month + "/" + year);
            $("#f05Cliente").text(data[0].Cliente);
            $("#f05Almacen").text(data[0].Almacen);
            $("#f05Despachador").text(data[0].Despachador);
            $("#f05TipoCarga").text(data[0].TipoCarga);
            $("#f05Cantidad").text(data[0].Cantidad);
            $("#f05Detalle").text(data[0].Detalle);

        } else {
            $("#f05FechaCreacion").text("N/A");
            $("#f05Cliente").text("N/A");
            $("#f05Almacen").text("N/A");
            $("#f05Despachador").text("N/A");
            $("#f05TipoCarga").text("N/A");
            $("#f05Cantidad").text("N/A");
            $("#f05Detalle").text("N/A");
        }
    });


    console.log("NumOperacion: " + this.dataItem(seleccion).NumOperacion);
    getBotonera(this.dataItem(seleccion).NumOperacion);

    $("#f05divBotonera").html("");
    
    var templateCpt = kendo.template($("#javascriptTemplate").html());
    var dsCpt = [CaptureF, CaptureD];
    
    var resultDS = templateCpt(dsCpt);
    $("#CapturasIMG").html(resultDS); 
     
    window.location.href = "#f05accionOperacion";
    
    
}

function getBotonera(NumOperacion) {
    //NumOperacion = $("#NumOperacion").val();
    var f05dsBotonera = new kendo.data.DataSource({
        transport: {
            read: {
                //Levante-Notoficacion: 239257,224322
                //Canal: 239257,239255,227192,227840,228961,227840
                url: WServ + "Operaciones/Opciones/" + NumOperacion, //NumOperacion: 78503,232302,241557,241557
                dataType: "json",
                type: "get"
            }
        }
        // data: [{
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 2,
        //     "Opcion": "INICIO",
        //     "Habilitado": 0
        // }, {
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 2,
        //     "Opcion": "PERMISO OK",
        //     "Habilitado": 0
        // }, {
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 3,
        //     "Opcion": "SOL TRANSPORTE",
        //     "Habilitado": 0
        // }, {
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 4,
        //     "Opcion": "LEVANTE",
        //     "Habilitado": 0
        // }, {
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 5,
        //     "Opcion": "CANAL",
        //     "Habilitado": 0
        // }, {
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 6,
        //     "Opcion": "NOTIFICAR",
        //     "Habilitado": 0
        // }, {
        //     "IdOperacion": 1,
        //     "Operacion": "RETIRO",
        //     "IdOpcion": 7,
        //     "Opcion": "TERMINAR",
        //     "Habilitado": 1
        // }]
    });
    f05dsBotonera.fetch(function () {
        $("#f05divBotonera").html("");
        var data = this.data();
        var activo = false;
        for (var i = 0; i < f05dsBotonera.total(); i++) {
            var opcion = data[i];
            if (opcion.Opcion) {
                var Opcion = opcion.Opcion.toLowerCase();
                Opcion = Opcion.charAt(0).toUpperCase() + Opcion.slice(1);
            }

            if (opcion.Habilitado == 1) {
                //activo = true;
                if (i + 1 == f05dsBotonera.total()) { // si es la uúltima operación preguntar si desea agregar fotos
                    $("#f05divBotonera").append(['<div class="btn-group btn-block"><button class="btn btn-success btn-block font-boton" onclick="tipoFuncion(' + "'" + Opcion + "'" + ',' + NumOperacion + ',' + "'Ultimo'" + ');"> <span class="fa fa-unlock-alt" aria-hidden="true"></span> ' + Opcion + ' </button></div>']);
                } else {
                    $("#f05divBotonera").append(['<div class="btn-group btn-block"><button class="btn btn-success btn-block font-boton" onclick="tipoFuncion(' + "'" + Opcion + "'" + ',' + NumOperacion + ');"> <span class="fa fa-unlock-alt" aria-hidden="true"></span> ' + Opcion + ' </button></div>']);
                }
            } else {
                $("#f05divBotonera").append(['<div class="btn-group btn-block"><button class="btn btn-default btn-block font-boton" onclick="tipoFuncion(' + "'" + Opcion + "'" + ',' + NumOperacion + ');" disabled> <span class="fa fa-lock" aria-hidden="true"></span> ' + Opcion + ' </button></div>']);
            }
            //->Se insertará botones = a la cantidad de filas
            //El botón activo será el primer botón con valor "Habilitado" == 1

            // if (activo == false && opcion.Habilitado == 1 && activo == false) {
            //     activo = true;
            //     if (i + 1 == f05dsBotonera.total()) { // si es la uúltima opración preguntar si desea agregar fotos
            //         $("#f05divBotonera").append(['<div class="btn-group btn-block"><button class="btn btn-success btn-block font-boton" onclick="tipoFuncion(' + "'" + Opcion + "'" + ',' + NumOperacion + ',' + "'Ultimo'" + ');"> <span class="fa fa-unlock-alt" aria-hidden="true"></span> ' + Opcion + ' </button></div>']);
            //     } else {
            //         $("#f05divBotonera").append(['<div class="btn-group btn-block"><button class="btn btn-success btn-block font-boton" onclick="tipoFuncion(' + "'" + Opcion + "'" + ',' + NumOperacion + ');"> <span class="fa fa-unlock-alt" aria-hidden="true"></span> ' + Opcion + ' </button></div>']);
            //     }

            // } else {
            //     $("#f05divBotonera").append(['<div class="btn-group btn-block"><button class="btn btn-default btn-block font-boton" onclick="tipoFuncion(' + "'" + Opcion + "'" + ',' + NumOperacion + ');" disabled> <span class="fa fa-lock" aria-hidden="true"></span> ' + Opcion + ' </button></div>']);
            // }
            //<-
        }
    });
}

function tipoFuncion(accion, NumOperacion, Ultimo) {
    // Definimos el modal de confirmación aquí
    $("#f05dialog").css("display", "block");
    $("#f05dialog").kendoWindow({
        scrollable: false,
        modal: true,
        visible: false,
        activate: function () {
            $("#f05dialog").data("kendoWindow").center();
        }
    });
    $("#f05dialog").data("kendoWindow").center();
    $("#f05dialog").data("kendoWindow").title("Confirmar: " + accion);
    $("#f05dialog").data("kendoWindow").open();

    $("#btnFuncionFoto05").text("Cancelar");
    $("#btnFuncionFoto05").attr("onclick", "$('#f05dialog').data('kendoWindow').close();");
    $("#cuerpoModal").html('');

    switch (accion) {
        case "Inicio":
            accion = "Iniciar";
            break;
        case "Levante":
            $("#cuerpoModal").html('<input id="dtpLevante" type="date" class="form-control input-md font-cuerpo">');
            break;
        case "Canal":
            $("#cuerpoModal").html(['<div class="btn-group" data-toggle="buttons">' +
                '<label class="btn btn-success font-cuerpo active">' +
                    '<input value="1" type="radio" name="txtprioridad" autocomplete="off" checked><span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span> V' +
                '</label>' +
                '<label class="btn btn-warning font-cuerpo">' +
                    '<input value="2" type="radio" name="txtprioridad" autocomplete="off"> N' +
                '</label>' +
                '<label class="btn btn-danger font-cuerpo">' +
                    '<input value="3" type="radio" name="txtprioridad" autocomplete="off"> R' +
                '</label>' +
            '</div>']);
            break;
        case "Permiso ok":
            accion = "Permiso";
            break;
        case "Sol transporte":
            accion = "Solicitar";
            break;
        case "Notificacion":
            accion = "Notificar";
            break;
        case "Fin":
            accion = "Terminar";
            $("#btnFuncionFoto05").html('<span class="fa fa-camera" aria-hidden="true"></span> Fotos');
            $("#btnFuncionFoto05").attr("onclick", "kendo.mobile.application.navigate('components/funcionalidad05/captureView.html');$('#f05dialog').data('kendoWindow').close();");
            break;
        default:
            break;
    }
    if (Ultimo) {
        $("#cuerpoModal").append('<h5 class="font-cuerpo">¿Desea agregar una foto?</h5><h5 class="font-cuerpo">Al dar click en fotos, podrá tomar fotos.</h5><h5 class="font-cuerpo">Al dar click en aceptar, se ejecutará la acción.</h5>');
    }
    $("#btnFuncion05").attr("onclick", "f05funcion('" + accion + "'," + NumOperacion + ");");
    $('#dtpLevante').parent().removeClass("has-error");
}


function aumentarFont() {
    var fontSize = parseInt($(".font-cuerpo").css("font-size"));
    fontSize = fontSize + 1 + "px";
    $('.font-cuerpo').css({
        'font-size': fontSize
    });
}

function disminuirFont() {
    var fontSize = parseInt($(".font-cuerpo").css("font-size"));
    fontSize = fontSize - 1 + "px";
    $('.font-cuerpo').css({
        'font-size': fontSize
    });
}

function f05funcion(accion, NumOperacion) {
    //Test: Canal=0,Permiso=1,Levante=0,Notificar=0,Solicitar=0,Iniciar=0,Terminar=0
    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //end
    if ($('#dtpLevante').val() == "") {
        $('#dtpLevante').parent().addClass("has-error");
        notificationWidget.show("Ingrese la fecha", "error");
        return;
    }

    var txtidUsuario = sessionStorage.getItem("sessionUSER");
    txtidUsuario = 126; //borrar en producción

    switch (accion) {
        case "Iniciar":
            $.ajax({
                url: WServ + 'Operaciones/Iniciar',
                type: "post",
                data: {
                    txtid: NumOperacion, //numOperacion del detalle de la operación
                    txtidUsuario: txtidUsuario //id del usuario
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Iniciar realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Iniciar", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;
        case "Canal":
            $.ajax({
                url: WServ + 'Operaciones/Canal',
                type: "post",
                data: {
                    operacion: NumOperacion,
                    usuario: txtidUsuario,
                    canal: $('input:radio[name=txtprioridad]:checked').val()
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Canal realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Canal", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;
        case "Permiso":
            $.ajax({
                url: WServ + 'Operaciones/Permiso',
                type: "post",
                data: {
                    txtid: NumOperacion, //numOperacion del detalle de la operación
                    txtidUsuario: txtidUsuario //id del usuario
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Permiso realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Permiso", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;
        case "Levante":
            $.ajax({
                url: WServ + 'Operaciones/Levante',
                type: "post",
                data: {
                    operacion: NumOperacion,
                    usuario: txtidUsuario,
                    fecha: $('#dtpLevante').val()
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Levante realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Levante", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;
        case "Notificar":
            $.ajax({
                url: WServ + 'Operaciones/Notificar',
                type: "post",
                data: {
                    operacion: NumOperacion,
                    usuario: txtidUsuario
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Notificar realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Notificar", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;
        case "Solicitar":
            $.ajax({
                url: WServ + 'Operaciones/Solicitar',
                type: "post",
                data: {
                    txtid: NumOperacion, //numOperacion del detalle de la operación
                    txtidUsuario: txtidUsuario //id del usuario
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Solicitar realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Solicitar", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;
        case "Terminar":
            $.ajax({
                url: WServ + 'Operaciones/Terminar',
                type: "post",
                data: {
                    txtid: NumOperacion, //numOperacion del detalle de la operación
                    txtidUsuario: txtidUsuario //id del usuario
                },
                async: false,
                success: function (datos) {
                    var data = [];
                    data = JSON.parse(datos);
                    if (data[0].Ejecucion == 0) {
                        $('#f05dialog').data('kendoWindow').close();
                        getBotonera(NumOperacion);
                        notificationWidget.show("Operación: Terminar realizado correctamente", "success");
                        geoRefBotonera();
                    } else {
                        notificationWidget.show("No se pudo ejecutar la operación: Terminar", "error")
                    }
                },
                error: function () {
                    notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                }
            });
            break;

        default: //"OTRA FUNCION"
            notificationWidget.show("La operación no existe", "error")
            break;
    }
}

function geoRefBotonera() {
    navigator.geolocation.getCurrentPosition(geoRFEnviado, onErrorRef, {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    });
}

function onErrorRef(error) {
    alert(error.code);
    alert(error.message);
}

function geoRFEnviado(position) {
    //console.log("lat "+position.coords.latitude.toPrecision(10));
    //console.log("long "+position.coords.longitude.toPrecision(10)); 
    $.ajax({
        type: "POST",
        url: WServ + 'Operaciones/UbicacionInsertar',
        data: {
            usuario: sessionStorage.sessionUSER, //id usuario en session
            latitud: position.coords.latitude.toPrecision(10),
            longitud: position.coords.longitude.toPrecision(10),
            operacion: f05NumOperacion  //valor de la operacion 
        },
        async: false,
        success: function (datos) {
            /*console.log(datos);
            var data = JSON.parse(datos);
            alert("success: "+data);*/
        },
        error: function (datos) {
            /*console.log(datos);
            var data = JSON.parse(datos);
            alert("error: "+data);*/
        }
    });

}