'use strict';

app.funcionalidad02 = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
});

function getOrden(year, order) {
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");

    $('#f02order,#f02year').parent().removeClass("has-error");
    if ($('#f02year').val() == "") {
        $('#f02year').parent().addClass("has-error");
        notificationWidget.show("Ingrese la fecha de orden", "error");
        return;
    }
    if ($('#f02year').val().length != 4) {
        $('#f02year').parent().addClass("has-error");
        notificationWidget.show("Ingrese una fecha correcta", "error");
        return;
    }
    if ($('#f02order').val() == "") {
        $('#f02order').parent().addClass("has-error");
        notificationWidget.show("Ingrese el número de orden", "error");
        return;
    }
    //Para completar con ceros la cadena
    var ceros = 6 - $("#f02order").val().length;
    for (var i = 0; i < ceros; i++) {
        order = "0" + $("#f02order").val();
        $("#f02order").val(order);
    }
    //fin
    var cliente = sessionStorage.getItem("sessionUSER");
    if (cliente > 0) {

    } else {
        alert("Ingrese id de usuario");
        return;
    }
    var dsOrden = new kendo.data.DataSource({
        transport: {
            read: {
                //url: WServ +"Ordenes/valor?fecha=" + year + "&id=" + order + "&cliente=" + cliente,
                url: WServ + "Ordenes/valorA?fecha=" + year + "&id=" + order,
                dataType: "json"
            }
        },
        schema: {
            data: function (data) {
                return data;
            }
        },
        requestStart: function (e) {
            kendo.ui.progress($("#ListaOrdenes"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#ListaOrdenes"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#ListaOrdenes"), false);
            alert("El Servicio no esta Disponible.");
        }
    });

    dsOrden.fetch(function () {
        if (dsOrden.total() > 0) { //Si existe la orden
            var data = dsOrden.data();
            var orden = data[0];
            var dsDetOrden = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: WServ + "Ordenes/detalle/" + orden.ord_int_id, 
                        dataType: "json"
                    }
                },
                schema: {
                    data: function (data) {
                        return data;
                    }
                },
                requestStart: function (e) {
                    kendo.ui.progress($("#det-orden"), true);
                },
                requestEnd: function (e) {
                    kendo.ui.progress($("#det-orden"), false);
                },
                error: function (e) {
                    kendo.ui.progress($("#det-orden"), false);
                    alert("El Servicio no esta Disponible.");
                }

            });
            $("#f02cabecera").html('');
            $("#f02detalle").html('');

            dsDetOrden.fetch(function () {
                var html = [];
                var data = dsDetOrden.data();

                /*aqui kike*/
                for (var i = 0; i < data.length; i++) {
                    var dsRG = data[i];
                    /* del 0 al 7 son los datos bases para la cabecera e informacion principal */
                    if (i < 8) {
                        // console.log(" Cabecera " + dsRG.Nombre + ":" + dsRG.Valor);

                        switch (i) {
                            case 0:
                                $("#f02cabecera").append('<p>' + "Nro de la Orden: " + $("#f02year").val() + "-" + $("#f02order").val() + '</p>');
                                break;
                            case 1:
                                break;
                            case 2:
                                $("#f02cabecera").append('<p>' + "Referencia: " + dsRG.Valor + '</p>');
                                break;
                            case 3:


                                if (dsRG.Valor == "V") {
                                    $("#f02cabecera").append('<p>' + "Canal: " + ' <i class="fa fa-circle text-success"></i> ' + dsRG.Valor + '</p>');
                                } else if (dsRG.Valor == "N") {
                                    $("#f02cabecera").append('<p>' + "Canal: " + ' <i class="fa fa-circle text-warning"></i> ' + dsRG.Valor + '</p>');
                                } else {
                                    $("#f02cabecera").append('<p>' + "Canal: " + ' <i class="fa fa-circle text-danger"></i> ' + dsRG.Valor + '</p>');
                                }
                                break;
                            case 4:
                                if (dsRG.Valor == "MARITIMO") {
                                    $("#f02cabecera").append('<p>' + "Via: " + '<i class = "fa fa-ship text-muted"></i> ' + dsRG.Valor + '</p>');
                                } else if (Via == "TERRESTRE") {
                                    $("#f02cabecera").append('<p>' + "Via: " + '<i class = "fa fa-truck text-muted"></i> ' + dsRG.Valor + '</p>');
                                } else {
                                    $("#f02cabecera").append('<p>' + "Via: " + '<i class = "fa fa-plane text-muted"></i> ' + dsRG.Valor + '</p>');
                                }
                                break;
                            case 5:
                                $("#f02regimen").html('Régimen: ' + dsRG.Valor);
                                break;
                            case 6:
                                $("#f02cabecera").append('<p>' + "Tipo de despacho: " + dsRG.Valor + '</p>');
                                break;
                            case 7:
                                $("#f02cabecera").append('<p>' + "Mercadería: " + dsRG.Valor + '</p>');
                                break;
                            default:
                                break;
                        }
                    } else {
                        // console.log(" Fechas " + dsRG.Nombre + ":" + dsRG.Valor);
                        if (dsRG.Valor != null) {
                            var ARcadena = (dsRG.Valor).split(" | ");
                            //console.log(" Etiqueta " + ARcadena[0] + ":" + ARcadena[1]);
                            var etiqueta = "";
                            switch (ARcadena[0]) {
                                case "AforoCulminado":
                                    etiqueta = "Aforo Culminado";
                                    break;
                                case "LlegadaNave":
                                    etiqueta = "Llegada de la Nave";
                                    break;
                                case "FechaCancelacion":
                                    etiqueta = "Fecha de Cancelación";
                                    break;
                                case "LevanteAutorizado":
                                    etiqueta = "Levante Autorizado";
                                    break;
                                case "RetiroCulminado":
                                    etiqueta = "Retiro Culminado";
                                    break;
                                case "FechaNumeracion":
                                    etiqueta = "Fecha de Numeración";
                                    break;
                                case "ETAEstimado":
                                    etiqueta = "ETA Estimado";
                                    break;
                                case "Apertura":
                                    etiqueta = "Apertura de la Orden";
                                    break;
                                case "DocumentosCompletos":
                                    etiqueta = "Documentos Completos";
                                    break;
                                case "TerminoDescarga":
                                    etiqueta = "Término de descarga";
                                    break;
                                case "DAMcliente":
                                    etiqueta = "Se envió DAM regularizada al cliente";
                                    break;
                                case "RecepDocs":
                                    etiqueta = "Recepción de documentos originales";
                                    break;
                                case "EmbarqueExito":
                                    etiqueta = "Embarque de mercancía concluido con éxito";
                                    break;
                                case "IniciarTramite":
                                    etiqueta = "Se recibieron instrucciones para iniciar el trámite";
                                    break;
                                case "DAMDefinitiva":
                                    etiqueta = "Numeración DAM definitiva";
                                    break;
                                case "Regularizacion":
                                    etiqueta = "Regularización del despacho culminado";
                                    break;
                                case "TramiteVisto":
                                    etiqueta = "Trámite de Visto Bueno Culminado";
                                    break;
                                case "DAMFisico":
                                    etiqueta = "DAM seleccionada a control documentario o aforo físico";
                                    break;
                                case "DAM":
                                    etiqueta = "DAM numerada provisional";
                                    break;
                                case "ESC":
                                    etiqueta = "ESC instruye ingreso / llenado";
                                    break;
                                case "MercanciaPuerto":
                                    etiqueta = "Mercancía ingresada al depósito temporal / Puerto";
                                    break;
                                default:
                                    etiqueta = ARcadena[0];
                                    break;
                            }
                            if (ARcadena[1] !== "") {
                                $("#f02detalle").append('<button type="button" class="list-group-item centrar"><span class="glyphicon glyphicon-ok text-success icono_sep icono_centrado" aria-hidden="true"></span><span class="span_centro">' + etiqueta + ":" + "</br>" + ARcadena[1].substring(0, 10) + '</span></button>');
                            } else {
                                html.push('<button type="button" class="list-group-item centrar"><span class="glyphicon glyphicon-exclamation-sign text-danger icono_centrado" aria-hidden="true"></span><span class="span_centro">' + etiqueta + '</span></button>');
                            }
                        }

                    }
                }
                $("#f02NumOrden").html('<p>' + "Nro de la Orden: " + $("#f02year").val() + "-" + $("#f02order").val() + '</p>');
                $("#f02detalle").append(html);
            });

            window.location.href = "#det-orden1";
        } else {
            notificationWidget.show("La orden no está asignada", "error");
        }
    });
}

//funcion solo deja colocar numeros sin punto ni coma (etiketas number)
function soloNumeros(evt) {
    if ($("#f02order").val().length > 5) {
        return false;
    }
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
