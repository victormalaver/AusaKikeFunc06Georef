'use strict';
app.funcionalidad04 = kendo.observable({
    onShow: function () {

    },
    afterShow: function () {

    },
});

function f04FechaAtencionConsilidato() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;

    $("#f04FchAtencionConsilidato").val(today);
    f04getOperaciones($("#f04FchAtencionConsilidato").val());
}

//getOperaciones -> cargamos el grid tareas
function f04getOperaciones(f04FchAtencionConsilidato) {
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    if (!$("#f04FchAtencionConsilidato").val()) {
        notificationWidget.show("Fecha incorrecta", "error");
        $('#f04FchAtencionConsilidato').parent().addClass("has-error");
        return;
    } else {
        $('#f04FchAtencionConsilidato').parent().removeClass("has-error");
    }
    //var idSS = sessionStorage.getItem("sessionUSER");
    var f04dsOperaciones = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/Listar",
                dataType: "json",
                type: "post",
                data: {
                    txtdespachador: 0,
                    txtcliente: 0,
                    txtorden: 0,
                    txtalmacen: 0,
                    txtestado: 9,
                    txtfecha: f04FchAtencionConsilidato, //"2015/09/24", //f04FchAtencionConsilidato,
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

    f04dsOperaciones.fetch(function () {
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
        if (f04dsOperaciones.total() > 0) {
            $("#f04operaciones").kendoGrid({
                dataSource: f04dsOperaciones,
                filterable: true,
                sortable: true,
                pageable: true,
                scrollable: false,
                selectable: "row",
                change: f04SelectGridDetOperacion,
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
                        title: "Fecha de creacion",
                        width: "120px",
                        filterable: {
                            messages: {
                                info: "Rango de creación: "
                            }
                        },
                        format: "{0:dd/MM/yyyy}"

            },
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
            $("#f04operaciones").css("display", "block");
        } else {
            $("#f04operaciones").css("display", "none");
            notificationWidget.show("No se encontraron operaciones el " + f04FchAtencionConsilidato, "error");
        }
    });
}


function f04SelectGridDetOperacion() {

    //getDespachador();

    //var seleccion = $(".k-state-selected").select();
    var grid = $("#f04operaciones").data("kendoGrid");
    var seleccion = grid.select();

    //INFORMACIONES DE PA /Operaciones/Listar

    if (this.dataItem(seleccion).Operacion) {
        $("#f04LVOperacion").text(this.dataItem(seleccion).Operacion);
    } else {
        $("#f04LVOperacion").text("N/A");
    }


    if (this.dataItem(seleccion).HoraInicio) {
        $("#f04LVHoraInicio").text(this.dataItem(seleccion).HoraInicio);
    } else {
        $("#f04LVHoraInicio").text("N/A");
    }


    if (this.dataItem(seleccion).Estado) {
        $("#f04LVEstado").text(this.dataItem(seleccion).Estado);
    } else {
        $("#f04LVEstado").text("N/A");
    }


    if (this.dataItem(seleccion).TiempoTranscurrido) {
        $("#f04LVTiempoTrasncurrido").text(this.dataItem(seleccion).TiempoTranscurrido + " dias.");
    } else {
        $("#f04LVTiempoTrasncurrido").text("N/A");
    }


    if (this.dataItem(seleccion).Detalle) {
        $("#f04Detalle").text(this.dataItem(seleccion).Detalle);
    } else {
        $("#f04Detalle").text("N/A");
    }


    //dsOperaciones -> obtenemos la lista de tareas
    var dsOperaciones = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/Detalle/" + this.dataItem(seleccion).NumOperacion, //226667
                dataType: "json",
                type: "get"
            },
        }
    });
    dsOperaciones.fetch(function () {
        if (dsOperaciones.total() > 0) {
            var data = this.data();
            var dateFechaCreacion = eval(" new " + data[0].FechaCreacion.replace(/\//g, '') + ";");

            var day = dateFechaCreacion.getDate();
            var month = dateFechaCreacion.getMonth() + 1;
            var year = dateFechaCreacion.getFullYear();
            $("#f04FechaCreacion").text(day + "/" + month + "/" + year);

            $("#f04NumOperacion").text(data[0].NumOperacion);
            $("#f04Cliente").text(data[0].Cliente);
            $("#f04Almacen").text(data[0].Almacen);
            $("#f04Orden").text(data[0].Orden);

            getDespachador(data[0].IdDespachador);

        } else {
            $("#f04FechaCreacion").text("N/A");
            $("#f04NumOperacion").text("N/A");
            $("#f04Cliente").text("N/A");
            $("#f04Almacen").text("N/A");
            $("#f04Orden").text("N/A");
        }
    });

    $("#f04dialogConfirmar").kendoWindow({
        title: "Confirmación",
        scrollable: false,
        modal: true,
        visible: false,
        activate: function () {
            $("#f04dialogConfirmar").data("kendoWindow").center();
        }
    });

    window.location.href = "#f04accionOperacion";


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

//getDespachador -> datos del select tipo de tarea
function getDespachador(campo) {
    //console.log(" DFC >>> getDespachador()");
    var idSS = campo;
    $("#txtIdDespachador").kendoDropDownList({
        dataSource: {
            transport: {
                read: {
                    url: WServ + "Operaciones/Despachadores",
                    dataType: "json",
                    type: "get",
                }
            }
        },
        dataTextField: "nomDespachador",
        dataValueField: "idDespachador",
        value: idSS
    });
}

function Reasignar() {
    var ddLDespachador = $("#txtIdDespachador").data("kendoDropDownList");
    var dataItem = ddLDespachador.dataItem();

    var dsReasignar = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/Reasignar/",
                dataType: "json",
                type: "post",
                data: {
                    txtid: parseInt($("#f04NumOperacion").html()),
                    txtdespachador: parseInt(dataItem.idDespachador),
                    txtobservacion: $("#f04Detalle").val()
                }
            },
        },
        requestStart: function (e) {
            kendo.ui.progress($("#f04accionOperacion"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#f04accionOperacion"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#f04accionOperacion"), false);
            alert("El Servicio no esta Disponible.");
        }
    });
    dsReasignar.fetch(
        function () {
            // CAMBIO POST REUNION 28/XII AGREGAR POP-UP CONFERMA REASIGNACION
            var data = this.data();
            // data[0].Msg
            // console.log("DFC >>> MSG REASIGNACION >>> " + data[0].Msg);
            $("#dialogReasinacion").kendoWindow({
                scrollable: false,
                modal: true,
                minHeight: "100",
                minWidth: "250",
                visible: false,
                activate: function () {
                    $("#dialogReasinacion").data("kendoWindow").center();
                }
            });
            $('#f04dialogConfirmar').data('kendoWindow').close();
            $("#dialogReasinacion").data("kendoWindow").center();
            $("#dialogReasinacion").data("kendoWindow").title('Reasignación');
            $("#dialogReasinacion").data("kendoWindow").open();
            // $("#msgReasinacion").html('Accion de REASIGNACION');
            $("#msgReasinacion").html(data[0].Msg);
            window.location.href = "#f04ContenedorOperaciones";
        }
    );

}