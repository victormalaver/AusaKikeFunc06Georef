'use strict';
app.funcionalidad03 = kendo.observable({
    onShow: function () {
        //Carga JavaScript 3st
    },
    afterShow: function () {
        //Carga JavaScript 4st        
    }
});
//getTareas -> cargamos el grid tareas


function getTareas() { 
        var idSS2 = sessionStorage.getItem("sessionUSER");
        //dsTareas -> obtenemos la lista de tareas
        var dsTareas = new kendo.data.DataSource({
            transport: {
                read: {
                    url: WServ + "Tareas/listar",
                    dataType: "json",
                    type: "post",
                    data: {
                        txtid: idSS2 //668
                    }
                }
            },
            //schema -> para mantener los filtror y para el formato date
            schema: {
                model: {
                    fields: {
                        tar_dat_fchcreacion: {
                            type: "date"
                        },
                        tar_dat_fchlimite: {
                            type: "date"
                        },
                        tar_int_estado: {
                            type: "string"
                        },
                        tar_int_prioridad: {
                            type: "string"
                        }
                    }
                }
            },
            pageSize: 10
        });

        // if (!$("#tareas").data("kendoGrid")) {
        //     document.addEventListener("deviceready", onDeviceReady, false);
        // };
        $("#tareas").kendoGrid({
            dataSource: dsTareas,
            filterable: true,
            sortable: true,
            pageable: true,
            scrollable: false,
            selectable: "row",
            change: selectGrid,
            filterMenuInit: filterMenu, //llamamos a la función de configuración de los filtros
            columns: [{
                    field: "tipotarea",
                    title: "Nombre de Tarea",
                    width: "360px",
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
                            info: "Filtrar por tarea: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    }
            },
                {
                    field: "Usuario",
                    title: "Cliente",
                    width: "150px",
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
                    field: "tar_dat_fchcreacion",
                    title: "F. Creación",
                    template: "#= kendo.toString(kendo.parseDate(tar_dat_fchcreacion, 'dd-MM-yyyy'), 'dd/MM/yyyy') #",
                    width: "120px",
                    filterable: {
                        messages: {
                            info: "Rango de creación: ",
                            filter: "Filtrar",
                            clear: "Limpiar"
                        }
                    },
                    format: "{0:dd/MM/yyyy}"
            },
                {
                    field: "tar_dat_fchlimite",
                    title: "F. Límite",
                    template: "#= kendo.toString(kendo.parseDate(tar_dat_fchlimite, 'dd-MM-yyyy'), 'dd/MM/yyyy') #",
                    width: "120px",
                    filterable: {
                        messages: {
                            info: "Rango de límite: ",
                        }
                    },
                    format: "{0:MM/dd/yyyy}"
            },
                {
                    field: "tar_int_estado",
                    title: "Estado",
                    template: '#if(tar_int_estado==1){#Pendiente#}else{#Cerrado#}#',
                    width: "100px",
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
            },
                {
                    field: "tar_int_prioridad",
                    title: "Prioridad",
                    template: '#if(tar_int_prioridad==1){#<span class = "glyphicon glyphicon-arrow-down text-success" aria-hidden = "true" ></span>Baja#}else{if(tar_int_prioridad==3){#<span class="glyphicon glyphicon-arrow-up text-danger" aria-hidden="true"></span>Alta#}else{#<span class = "glyphicon glyphicon glyphicon-arrow-right text-warning" aria-hidden="true"></span>Media#}}#',
                    width: "110px",
                    filterable: {
                        extra: false,
                        operators: {
                            string: {
                                contains: "Contiene"
                            }
                        },
                        messages: {
                            info: "Filtrar por prioridad: ",
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
                    var f1 = kendo.parseDate(items[i].tar_dat_fchlimite, 'dd-MM-yyyy');
                    var f2 = kendo.parseDate(items[i].tar_dat_fchcreacion, 'dd-MM-yyyy');
                    var diff = new Date(f1 - f2);
                    var days = diff / 1000 / 60 / 60 / 24;
                    if (days < 2) {
                        row.addClass("row-danger");
                    } else if (days >= 2 && days < 7) {
                        row.addClass("row-warning");
                    } else {
                        row.addClass("row-default");
                    }
                }
            }
        });
        //filterMenu -> para configurar los filtros
        function filterMenu(e) {
            if (e.field == "tar_dat_fchlimite") {
                var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
                beginOperator.value("gte");
                beginOperator.trigger("change");

                var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
                endOperator.value("lte");
                endOperator.trigger("change");
                e.container.find(".k-dropdown").hide()
            }
            if (e.field == "tar_dat_fchcreacion") {
                var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
                beginOperator.value("gte");
                beginOperator.trigger("change");

                var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
                endOperator.value("lte");
                endOperator.trigger("change");
                e.container.find(".k-dropdown").hide()
            }
            if (e.field == "tar_int_estado") {
                //e.container.find("k-widget.k-dropdown.k-header").css("display", "none");
                // Change the text field to a dropdownlist in the Role filter menu.
                e.container.find(".k-textbox:first")
                    //.removeClass("k-textbox")
                    .kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            data: [
                                {
                                    title: "Pendiente",
                                    value: 1
                            },
                                {
                                    title: "Cerrado",
                                    value: 0
                            }
                                ]
                        }),
                        dataTextField: "title",
                        dataValueField: "value"
                    });
            }
            if (e.field == "tar_int_prioridad") {
                //e.container.find("k-widget.k-dropdown.k-header").css("display", "none");
                // Change the text field to a dropdownlist in the Role filter menu.
                e.container.find(".k-textbox:first")
                    //.removeClass("k-textbox")
                    .kendoDropDownList({
                        dataSource: new kendo.data.DataSource({
                            data: [
                                {
                                    title: "Alta",
                                    value: 3
                            },
                                {
                                    title: "Media",
                                    value: 2
                            },
                                {
                                    title: "Baja",
                                    value: 1
                            }
                                ]
                        }),
                        dataTextField: "title",
                        dataValueField: "value"
                    });
            }

        };



        $("#f03dialog").kendoWindow({
            title: "Confirmación",
            scrollable: false,
            modal: true,
            visible: false,
            activate: function () {
                $("#f03dialog").data("kendoWindow").center();
            }
        });

        $("#f03dialogBack").kendoWindow({
            title: "Confirmación",
            scrollable: false,
            modal: true,
            visible: false,
            activate: function () {
                $("#f03dialogBack").data("kendoWindow").center();
            }
        });
 
    }
    //viewFormTarea -> función para agregar nueva tarea
function viewFormTarea() {
        window.location.href = "#accionTarea";

        $('#formAdd')[0].reset();
        getSelectTipoTarea("add");
        getSelectCliente("add");
        $('#divBtnAdd').show();
        $('#divBtnAccion').css("display", "none");
        $("#divAudioEstado").css("display", "none");

    }
    //getSelectTipoTarea -> datos del select tipo de tarea
function getSelectTipoTarea(accion) {
    $("#txtidtt").kendoDropDownList({
        dataSource: {
            transport: {
                read: {
                    url: WServ + "Tareas/tipoListar",
                    dataType: "json"
                }
            }
        },
        requestStart: function (e) {
            kendo.ui.progress($("#accionTarea"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#accionTarea"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#accionTarea"), false);
            alert("El Servicio no esta Disponible.");
        },
        dataTextField: "tiptar_str_nombre",
        dataValueField: "tiptar_int_id"
    });

    if (accion !== "add") {
        var dropdownlist = $("#txtidtt").data("kendoDropDownList");
        dropdownlist.value(accion);
    };
}

function getSelectCliente(accion) {
    var idSS2 = sessionStorage.getItem("sessionUSER");
    var f03dsClientes = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Clientes/cartera/" + idSS2, //305
                dataType: "json"
            }
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        type: "number"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    }
                }
            }
        },
        requestStart: function (e) {
            kendo.ui.progress($("#accionTarea"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#accionTarea"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#accionTarea"), false);
            alert("El Servicio no esta Disponible.");
        }
    });
    

    if (!$("#txtidc").data("kendoMultiSelect")) {
        $("#txtidc").kendoMultiSelect({
            dataSource: f03dsClientes,
            dataTextField: "ClienteRazonSocial",
            dataValueField: "ClienteID",
            filter: "contains",
            minLength: 3
        });
    }else{
        $("#txtidc").data("kendoMultiSelect").setDataSource(f03dsClientes); 
    }

    //Si se seleccionó la fila, buscamos la lista de clientes y asignamos el valor del kendoMultiSelect con el valor de accion
    var values = [];
    if (accion !== "add") {
        var dsTareaCliente = null;
        dsTareaCliente = new kendo.data.DataSource({
            transport: {
                read: {
                    url: WServ + "Relaciones/clistar",
                    dataType: "json",
                    type: "post",
                    data: {
                        txtid: accion
                    }
                }
            }
        });
        dsTareaCliente.fetch(function () {
            var data = dsTareaCliente.data();
            for (var i = 0; i < dsTareaCliente.total(); i++) {
                var TareaCliente = data[i];
                values.push(TareaCliente.cli_int_id);
            };
            var multiselect = $("#txtidc").data("kendoMultiSelect");
            multiselect.value(values);
        });
    }
}

function modalTarea(accion) {
    $("#f03dialog").data("kendoWindow").center();
    $('#f03dialog').data('kendoWindow').open();
    switch (accion) {
        case 'insert':
            $("#f03divMensaje").text("¿Realmente desea agregar la tarea?");
            $("#f03btnAccionModal").attr("onclick", "accionTarea('insert');");
            break;
        case 'update':
            $("#f03divMensaje").text("¿Realmente desea editar la tarea?");
            $("#f03btnAccionModal").attr("onclick", "accionTarea('update');");
            break;
        default:
            $("#f03divMensaje").text("¿Realmente desea eliminar la tarea?");
            $("#f03btnAccionModal").attr("onclick", "accionTarea('delete');");
            break;
    }
    $("#f03btnAccionModal").removeAttr("disabled");
}

//accionTarea -> Función Agregar. Editar y Eliminar Tarea
function accionTarea(accion) {
    $("#f03btnAccionModal").attr("disabled", "disabled");
    $('#f03dialog').data('kendoWindow').close();
    var idSS = sessionStorage.getItem("sessionUSER");

    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //end

    var valido = true;
    $('#txtidc, #txtuserid, #txtidtt, #txtobserv, #txtdetalle, #txtflimite').parent().parent().removeClass("has-error");
    $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#ccc");
    var txtidc = $("#txtidc").data("kendoMultiSelect");
    if (txtidc.value() == "") {
        $('#txtidc').parent().parent().addClass("has-error");
        $('.k-multiselect-wrap.k-floatwrap').css("border-width", "1px");
        $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#a94442");
        valido = false;
    }
    if ($('#txtidtt option').size() == 0) {
        $('#txtidtt').parent().parent().addClass("has-error");
        valido = false;
    }
    if ($('#txtobserv').val() == "") {
        $('#txtobserv').parent().parent().addClass("has-error");
        valido = false;
    }
    if ($('#txtflimite').val() == "") {
        $('#txtflimite').parent().parent().addClass("has-error");
        valido = false;
    }

    valido && $.ajax({
        type: "POST",
        url: WServ + 'Tareas/' + accion,
        data: {
            txtuserid: idSS, //668
            txtid: $('#txtid').val(),
            txtidtt: $('#txtidtt option:selected').val(),
            txtorden: $('#txtorden').val(),
            txtobserv: $('#txtobserv').val(),
            txtdetalle: $('#txtdetalle').val(),
            txtprioridad: $('input:radio[name=txtprioridad]:checked').val(),
            txtestado: $('#txtestado').val(),
            txtflimite: $('#txtflimite').val() + " 00:00:00"
        },
        async: false,
        success: function (datos) {
            var data = [];
            data = JSON.parse(datos);
            var txtidc = $('#txtidc').val();
            if (data[0].Column1 > 0) { //Si devuelve el valor de la tarea agregada
                for (var i = 0; i < $('#txtidc').val().length; i++) {
                    $.ajax({ // INSERT
                        type: "post",
                        url: WServ + 'Relaciones/cinsert',
                        data: {
                            txtid: data[0].Column1,
                            txtidc: txtidc[i]
                        },
                        async: false,
                        error: function () {
                            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                            valido = false;
                        }
                    });
                };
                if (valido) {
                    notificationWidget.show((accion == "insert" ? "Se agregó la nueva tarea: " + $('#txtidtt option:selected').text() : "Se editó la tarea" + $('#txtidtt option:selected').text()), "success");
                    var grid = $("#tareas").data("kendoGrid");
                    grid.dataSource.read();
                    window.location.href = "#tareas1";
                };

            }

            if ($('#txtid').val() > 0) { //Si es edición  o delete
                var dsTareaCliente = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: WServ + "Relaciones/clistar",
                            dataType: "json",
                            type: "post",
                            data: {
                                txtid: $('#txtid').val()
                            }
                        }
                    }
                });
                dsTareaCliente.fetch(function () {
                    var data = dsTareaCliente.data();
                    for (var i = 0; i < dsTareaCliente.total(); i++) {
                        var TareaCliente = data[i];
                        $.ajax({ // DELETE
                            type: "POST",
                            url: WServ + 'Relaciones/cdelete',
                            data: {
                                txtidt: $('#txtid').val(),
                                txtidc: TareaCliente.cli_int_id
                            },
                            async: false,
                            success: function (datos) {

                            },
                            error: function () {
                                notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                                valido = false;
                            }
                        });
                    };

                    for (var i = 0; i < $('#txtidc').val().length; i++) {
                        $.ajax({ // INSERT
                            type: "POST",
                            url: WServ + 'Relaciones/cinsert',
                            data: {
                                txtid: $('#txtid').val(),
                                txtidc: txtidc[i]
                            },
                            async: false,
                            error: function () {
                                notificationWidget.show("No se puede establecer la conexión al servicio", "danger");
                                valido = false;
                            }
                        });
                    };
                });
                if (valido) {
                    notificationWidget.show((accion == "delete" ? "Se eliminó la tarea: " + $('#txtidtt option:selected').text() : "Se guardó la información de: " + $('#txtidtt option:selected').text()), "success");
                    var grid = $("#tareas").data("kendoGrid");
                    grid.dataSource.read();
                    window.location.href = "#tareas1";
                };
            };
        },
        error: function () {
            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
        }
    });
}


//selectGrid-> Si se selecciona una fila del grid
function selectGrid() {
    window.location.href = "#accionTarea";
    $("#txtestado").val(2);
    tag_estado();
    //var seleccion = $(".k-state-selected").select();
    var grid = $("#tareas").data("kendoGrid");
    var seleccion = grid.select();

    $('#txtid').val(this.dataItem(seleccion).tar_int_id);
    getSelectCliente(this.dataItem(seleccion).tar_int_id); // Enviamos el valor de id_tarea para que lo seleccione
    getSelectTipoTarea(this.dataItem(seleccion).tiptar_int_id); // Enviamos el valor de tiptar_int_id para que lo seleccione
    $('#txtorden').val(this.dataItem(seleccion).tar_str_orden);
    $('#txtobserv').val(this.dataItem(seleccion).tar_str_observacion);
    $('#txtdetalle').val(this.dataItem(seleccion).tar_txt_detalle);
    $("input[type='radio']").parent().removeClass("active");

    $("span[type='btnCheck']").remove();
    switch (this.dataItem(seleccion).tar_int_prioridad) {
        case "1":
            $('#txtprioridad1').toggleClass("active");
            $('#txtprioridad1').prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
            break;
        case "2":
            $('#txtprioridad2').toggleClass("active");
            $('#txtprioridad2').prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
            break;
        default:
            $('#txtprioridad3').prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
            $('#txtprioridad3').toggleClass("active");
    };
    var tar_dat_fchlimite = kendo.toString(kendo.parseDate(this.dataItem(seleccion).tar_dat_fchlimite, 'dd-MM-yyyy'), 'yyyy-MM-dd');
    $('#txtflimite').val(tar_dat_fchlimite);

    $('#txtestado').val(this.dataItem(seleccion).tar_int_estado);

    $('#divBtnAdd').hide();
    $('#divBtnAccion').show();

    $('#txtidc, #txtuserid, #txtidtt, #txtorden, #txtobserv, #txtdetalle, #txtflimite').parent().parent().removeClass("has-error");
    $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#ccc");
    $("#divNotaVoz").html("");
    $("#divAudioEstado").show();

    $("#f03dialog").kendoWindow({
        title: "Confirmación",
        scrollable: false,
        modal: true,
        visible: false,
        activate: function () {
            $("#f03dialog").data("kendoWindow").center();
        }
    });
}

//Para mantener active el button-group
$(document).on("change", "input[type='radio']", function () {
    $("input[type='radio']").parent().removeClass("active");
    $(this).parent().toggleClass("active");
    $("span[type='btnCheck']").remove();
    $(this).parent().prepend('<span type="btnCheck" class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
});

function tag_estado() {
    if ($("#txtestado").val() == 2) {
        $("#txtestado").val(1);
        $("#txtestado").removeClass('text-success');
        $("#txtestado").addClass('fa-rotate-180');
        $("#txtestado").addClass('text-muted');
        $("#tag_estado").text('Pendiente');
    } else {
        $("#txtestado").val(2);
        $("#txtestado").removeClass('text-muted');
        $("#txtestado").removeClass('fa-rotate-180');
        $("#txtestado").addClass('text-success');
        $("#tag_estado").text('Cerrado');
    }
};

// edit delete tipo de tarea
function accionTT(tipo) {
    $('#modalAddTipoTarea').data('kendoMobileModalView').open();
    kendo.fx($("#modalAddTipoTarea")).zoom("in").play(); //Sirve para eliminar el bug del click en la misma posición del btn cancelar, que hace que al seleccionar se cierre inmediatamente el modal
    $("#btnTT").removeAttr("disabled");
    switch (tipo) {
        case "tipoUpdate":
            $('#btnTT').val('tipoUpdate');
            $('#btnTT').html('<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Editar');
            break;
        default:
            $('#btnTT').val('tipoInsert');
            $('#btnTT').html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Agregar');
            $('#txtnombre').val("");
            $('#txtdescripcion').val("");
            $('#txtidTT').val("");
    }
}

function adminTT() {
    var idSS = sessionStorage.getItem("sessionUSER");
    window.location.href = "#vistaTipoTareas";
    $("#administrarTipoTareas").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: WServ + "Tareas/tipoListar",
                    dataType: "json",
                    type: "get"
                }
            },
            //schema -> para mantener los filtror y para el formato date
            schema: {
                model: {
                    fields: {
                        tiptar_int_id: {
                            type: "number",
                            width: "15"
                        },
                        tiptar_str_nombre: {
                            type: "string"
                        },
                        tiptar_dat_ultimamodif: {
                            type: "date"
                        }
                    }
                }
            }
        },
        selectable: "row",
        change: function (e) {
            $('#modalAddTipoTarea').data('kendoMobileModalView').open();

            var selectedRows = this.select();
            var selectedDataItems = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var dataItem = this.dataItem(selectedRows[i]);
            }
            //var seleccion = $(".k-state-selected").select();
            var grid = $("#administrarTipoTareas").data("kendoGrid");
            var seleccion = grid.select();

            accionTT('tipoUpdate');
            $('#txtnombre').val(dataItem.tiptar_str_nombre);
            $('#txtdescripcion').val(dataItem.tiptar_str_descripcion);
            $('#txtidTT').val(dataItem.tiptar_int_id);
            //Sólo el usuario creador puede eliminar el tipo de tarea, si no lo es -> btnTT disabled
            if (idSS == dataItem.tiptar_int_usrcreacion) { //668
                $("#btnTT").removeAttr("disabled");
            } else {
                $("#btnTT").attr("disabled", "disabled");
            }
        },
        columns: [{
                //define template column with checkbox and attach click event handler
                title: "Nro",
                width: "55px"
            },
            {
                hidden: true,
                field: "tiptar_int_id",
                title: "ID"
            }, {
                field: "tiptar_str_nombre",
                title: "Tipo de Tareas"
            }, {
                field: "tiptar_dat_ultimamodif",
                title: "Fecha de Creación",
                format: "{0:dd-MM-yyyy}"
            }],
        dataBound: function (e) {
            var rows = e.sender.tbody.children();
            for (var i = 0; i < rows.length; i++) {
                var row = $(rows[i]);
                var cell = row.children().eq(0);
                cell.html(i + 1 + " <input type='checkbox' style='width:16px; height:16px;' id='cb" + i + "'>");
            }
        }
    });

}


//addTipoTarea -> Agregamos un nuevo tipo de tarea
function accionTipoTarea(accion) {
    var idSS = sessionStorage.getItem("sessionUSER");

    var valido = true;

    //Notificaciones 
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End

    if (accion == "tipoDelete") {
        var grid = $('#administrarTipoTareas').data('kendoGrid')._data;
        for (var i = 0; i < grid.length; i++) {
            if ($("#cb" + i).is(':checked') && grid[i]["tiptar_int_usrcreacion"] == idSS) { //668
                $.ajax({
                    url: WServ + 'Tareas/' + accion,
                    type: "post",
                    data: {
                        txtid: grid[i]["tiptar_int_id"],
                        txtuserid: idSS //668
                    },
                    async: false,
                    success: function (datos) {

                        var data = [];
                        data = JSON.parse(datos);

                        if (data[0].Ejecucion == 0) {
                            notificationWidget.show("Se eliminó el tipo de tarea: " + grid[i]["tiptar_str_nombre"], "success");
                            valido = false;
                        } else {
                            notificationWidget.show("No se pudo eliminar el tipo de tarea: " + grid[i]["tiptar_str_nombre"], "error");
                        }
                    },
                    error: function () {
                        notificationWidget.show("No se puede establecer la conexión al servicio", "error");
                    }
                });
            }
            if ($("#cb" + i).is(':checked') && grid[i]["tiptar_int_usrcreacion"] !== idSS && valido) { //668
                //notificationWidget.show("No es creador de: " + i + grid[i]["tiptar_str_nombre"], "error");
                notificationWidget.show("No tiene permiso para borrar.", "error");
            }
            valido = true;
        };
        $("#modalConfirmarDeleteTT").data("kendoMobileModalView").close();
        $('#administrarTipoTareas').data('kendoGrid').dataSource.read();
        $('#administrarTipoTareas').data('kendoGrid').refresh();
        return;
    }
    $('#txtnombre, #txtdescripcion').parent().parent().removeClass("has-error");
    if ($('#txtnombre').val() == "") {
        $('#txtnombre').parent().parent().addClass("has-error");
        valido = false;
    }
    if ($('#txtdescripcion').val() == "") {
        $('#txtdescripcion').parent().parent().addClass("has-error");
        valido = false;
    }

    valido && $.ajax({
        url: WServ + 'Tareas/' + accion,
        type: "post",
        data: {
            txtid: $('#txtidTT').val(),
            txtnombre: $('#txtnombre').val(),
            txtdescripcion: $('#txtdescripcion').val(),
            txtuserid: idSS //668
        },
        async: false,
        beforeSend: function () {
            kendo.ui.progress($("#modalAddTipoTarea"), true);
        },
        success: function (datos) {
            kendo.ui.progress($("#modalAddTipoTarea"), false);
            var data = [];
            data = JSON.parse(datos);
            if (data[0].Ejecucion == 0) {
                $("#modalAddTipoTarea").data("kendoMobileModalView").close();
                getSelectTipoTarea("add");
                notificationWidget.show((accion == "tipoInsert" ? "Se agregó nuevo tipo de tarea: " : "Se editó el tipo de tarea: ") + $('#txtnombre').val(), "success");

                $('#administrarTipoTareas').data('kendoGrid').dataSource.read();
                $('#administrarTipoTareas').data('kendoGrid').refresh();
            } else {
                notificationWidget.show("No se pudo agregar el tipo de tarea: " + $('#txtnombre').val(), "error");
            }
        },
        error: function () {
            kendo.ui.progress($("#modalAddTipoTarea"), false);
            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
        }
    });
}