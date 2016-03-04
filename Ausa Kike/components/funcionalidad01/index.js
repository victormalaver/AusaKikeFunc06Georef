'use strict';

app.funcionalidad01 = kendo.observable({
    beforeShow: function () {  
    },
    onShow: function () {},
    afterShow: function () {
        /*Analytics*/
            try {
				monitor.trackFeature("Funcionalidades.Funcionalidad01");
                console.log("Telerik Analytics Funcionalidades.Funcionalidad01");
            } catch (e) {
                console.log("Telerik Analytics exception: " + e.description);
            }
    },

    //TODO-WIP
    //DETALLE  Morosidad y Utilizacion Linea START
    MostraMorosidadUtilizacionLinea: function () {
        //console.log("DFC > MostraMorosidadUtilizacionLinea ");
        //console.log("Morosidad y Utilizacion de Linea >> ClienteID > " + ClienteID);
        var dsSituaccionPago = new kendo.data.DataSource({
            transport: {
                //Parametrizzare con ContactoID
                read: {
                    url: WServ + "Clientes/morosidad/" + ClienteID,
                    dataType: "json"
                },
            },
            schema: {
                model: {
                    id: "ClienteID",
                    fields: {
                        ClienteID: {
                            editable: false,
                            nullable: true,
                            type: "number"
                        },
                        ClienteRazonSocial: {
                            type: "string"
                        },
                        DeudaVencida: {
                            type: "string"
                        },
                        PlazoDePago: {
                            type: "string"
                        },
                        LíneaAsignada: {
                            type: "string"
                        },
                        UtilizacionActual: {
                            type: "string"
                        },
                        DiferenciaDeLineas: {
                            type: "string"
                        },
                        PorcUtilizacionDeLinea: {
                            type: "string"
                        },
                        UsoDeLineaPromedioUltSeisMeses: {
                            type: "string"
                        },
                        PorcUsoDeLineaPromedioUltSeisMeses: {
                            type: "string"
                        },
                    }
                }
            },
            requestEnd: function (e) {
                //console.log("dsSituaccionPago >> requestEnd");
            },
        });

        dsSituaccionPago.fetch(function () {
            var data = this.data(); 
            $("#detMULClienteRazonSocial").html(data[0].ClienteRazonSocial);
            $("#detMULDeudaVencida").html("$" + data[0].DeudaVencida);
            $("#detMULPlazoDePago").html(data[0].PlazoDePago);
            $("#detMULLíneaAsignada").html(data[0].LíneaAsignada);
            $("#detMULUtilizacionActual").html(data[0].UtilizacionActual);
            $("#detMULDiferenciaDeLineas").html(data[0].DiferenciaDeLineas);
            $("#detMULPorcUtilizacionDeLinea").html(data[0].PorcUtilizacionDeLinea);
            $("#detMULUsoDeLineaPromedioUltSeisMeses").html("$" + data[0].UsoDeLineaPromedioUltSeisMeses);
            $("#detMULPorcUsoDeLineaPromedioUltSeisMeses").html(data[0].PorcUsoDeLineaPromedioUltSeisMeses);
        });

        var dsCondicionesDePagoMUL = new kendo.data.DataSource({
            transport: {
                //Parametrizzare con ContactoID
                read: {
                    url: WServ + "Clientes/condpago/" + ClienteID,
                    dataType: "json"
                },
            },
            schema: {
                model: {
                    id: "ClienteID",
                    fields: {
                        ClienteID: {
                            editable: false,
                            nullable: true,
                            type: "number"
                        },
                        ClienteRazonSocial: {
                            type: "string"
                        },
                        LíneaFacturaAUSA: {
                            type: "string"
                        },
                        PlazoFacturaAUSA: {
                            type: "string"
                        },
                        LíneaLetrasAUSA: {
                            type: "string"
                        },
                        PlazoLetrasAUSA: {
                            type: "string"
                        },
                    }
                }
            },
            requestEnd: function (e) {
                //console.log("dsCondicionesDePagoMUL >> requestEnd");
            },
        });

        dsCondicionesDePagoMUL.fetch(function () {
            var data = this.data();
            $("#detMULLíneaFacturaAUSA").html("$" + data[0].LíneaFacturaAUSA);
            $("#detMULPlazoFacturaAUSA").html(data[0].PlazoFacturaAUSA);
            $("#detMULLíneaLetrasAUSA").html("$" + data[0].LíneaLetrasAUSA);
            $("#detMULPlazoLetrasAUSA").html(data[0].PlazoLetrasAUSA);
        });
    },
    //DETALLE  Morosidad y Utilizacion Linea START
});

// START_CUSTOM_CODE_funcionalidad01


var ClienteID = ""; 
var ContactoID = "";

function MostraDetalleCliente() {
    var grid = $("#lstCliente").data("kendoListView");
    var row = grid.select();
    ClienteID = this.dataItem(row).ClienteID;

    $("#det-nombre").html($.trim(this.dataItem(row).ClienteRazonSocial));
	
    var fechaAct = kendo.toString(kendo.parseDate(this.dataItem(row).FchModificacion, 'dd-MM-yyyy'), 'dd/MM/yyyy');
    var fhoraAct = kendo.toString(kendo.parseDate(this.dataItem(row).FchModificacion, 'hh:mm:ss'), 'hh:mm:ss');
    
    $("#txtfechareg").html($.trim(fechaAct));
    $("#txthorareg").html($.trim(fhoraAct));
    
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");

    //DETALLE CONTACTOS CLIENTE START        
    var dsContactosCliente = new kendo.data.DataSource({
        transport: {
            //Parametrizzare con ContactoID
            read: {
                url: WServ + "Clientes/contacto/" + ClienteID,
                dataType: "json"
            },
        },
    });
    
    var dsTelefonosContactoCliente = null;

    dsContactosCliente.fetch(function () {
        if (dsContactosCliente.total() > 0) {
            $("#ContactosCliente").kendoDropDownList({
                dataTextField: "ContactoNombre",
                dataValueField: "ContactoID",
                dataSource: dsContactosCliente,
                change: function (e) {
                    console.log("DFC >>> ContactosCliente >>> change");
                    // ContactoFechaCumpleanos
                    // get the dataItem corresponding to the selectedIndex.
                    $("#FechaCumpleanos").html($.trim(this.dataItem().ContactoFechaCumpleanos));
                    $("#MailCli").html($.trim(this.dataItem().ContactoEmail));
                    $("#CargoCli").html($.trim(this.dataItem().Cargo));
                    ContactoID = this.dataItem().ContactoID;
                    // console.log("DFC >>> change_evt ContactoID: "+ContactoID);
                    dsTelefonosContactoCliente = new kendo.data.DataSource({
                        transport: {
                            //Parametrizzare con ContactoID
                            read: {
                                url: WServ + "Clientes/contactoT?id=" + ClienteID + "&contacto=" + ContactoID,
                                dataType: "json"
                            },
                        },
                    });
                    
                    $("#TelefonosContactoCliente").kendoDropDownList({
                        cascadeFrom: "ContactosCliente",
                        dataTextField: "Numero",
                        dataValueField: "TelefonoID",
                        dataSource: dsTelefonosContactoCliente,
                        change: function (e) {
                            //console.log("DFC >>> TelefonosContactoCliente >>> change");
                        }
                    });

                },
				dataBound: function (e) {
                    //console.log("ContactosCliente >> dataBound");
                    $("#FechaCumpleanos").html($.trim("1 May."));
                    // dataItem from dsContactosCliente DataSource
                    // console.log("ContactosCliente >> dataBound >> dataItem(0): " + this.dataItem(0).ContactoID + " -- " + this.dataItem(0).ContactoNombre + " -- " + this.dataItem(0).ContactoFechaCumpleanos);
                    // ContactoFechaCumpleanos
                    $("#FechaCumpleanos").html($.trim(this.dataItem(0).ContactoFechaCumpleanos));
                    $("#MailCli").html($.trim(this.dataItem().ContactoEmail));
                    $("#CargoCli").html($.trim(this.dataItem().Cargo));
                    ContactoID = this.dataItem().ContactoID;
                    // console.log("DFC >>> dataBound_evt ContactoID: "+ContactoID);
                    dsTelefonosContactoCliente = new kendo.data.DataSource({
                        transport: { 
                            read: {
                                url: WServ + "Clientes/contactoT?id=" + ClienteID + "&contacto=" + ContactoID,
                                dataType: "json"
                            },
                        },
                    });
                    
                    $("#TelefonosContactoCliente").kendoDropDownList({
                        cascadeFrom: "ContactosCliente",
                        dataTextField: "Numero",
                        dataValueField: "TelefonoID",
                        dataSource: dsTelefonosContactoCliente,
                        change: function (e) {
                            //console.log("DFC >>> TelefonosContactoCliente >>> change");
                        }
                    });                    
				},
            });
            
            
            $("#f01detetalleContacto").show();
        } else {
            $("#f01detetalleContacto").hide();
            notificationWidget.show("No se encontraron datos de contactos", "error");
        }
    });

    //DETALLE CONTACTOS CLIENTE END

    //SITUACION DE PAGO START
    var dsSituaccionPago = new kendo.data.DataSource({
        transport: {
            //Parametrizzare con ContactoID
            read: {
                url: WServ + "Clientes/morosidad/" + ClienteID,
                dataType: "json"
            },
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        editable: false,
                        nullable: true,
                        type: "number"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    },
                    DeudaVencida: {
                        type: "string"
                    },
                    PlazoDePago: {
                        type: "string"
                    },
                    LíneaAsignada: {
                        type: "string"
                    },
                    UtilizacionActual: {
                        type: "string"
                    },
                    DiferenciaDeLineas: {
                        type: "string"
                    },
                    PorcUtilizacionDeLinea: {
                        type: "string"
                    },
                    UsoDeLineaPromedioUltSeisMeses: {
                        type: "string"
                    },
                    PorcUsoDeLineaPromedioUltSeisMeses: {
                        type: "string"
                    },
                }
            }
        },
        requestEnd: function (e) {
            //console.log("dsSituaccionPago >> requestEnd");
        },
    });

    dsSituaccionPago.fetch(function () {
        if (dsSituaccionPago.total() > 0) {
            var data = this.data();
            //console.log("dsSituaccionPago >> data fetch()");
            //console.log(data.length);
            //console.log("ClienteRazonSocial >> " + data[0].ClienteRazonSocial);
            //console.log("PlazoDePago >> " + data[0].PlazoDePago);
            $("#PorcUtilizacionDeLinea").html(data[0].PorcUtilizacionDeLinea + "%");
            $("#f01situacionPago").show();
        } else {
            $("#f01situacionPago").hide();
            notificationWidget.show("No se encontró situación de pago", "error");
        }
    });

    //SITUACION DE PAGO END

    //PARTICIPACION AUSA Y OTRAS AGENCIAS START
    var dsParticipacionAUSAyAgencias = new kendo.data.DataSource({
        transport: {
            //Parametrizzare con ContactoID
            read: {
                url: WServ + "Clientes/participacionD/" + ClienteID,
                dataType: "json"
            },
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        editable: false,
                        nullable: true,
                        type: "number"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    },
                    Agente: {
                        type: "string"
                    },
                    NumDespachosVigentes: {
                        type: "string"
                    },
                    PorcDespachosVigentes: {
                        type: "string"
                    },
                    NumDespachosAnterior: {
                        type: "string"
                    },
                    PorcDespachosAnterior: {
                        type: "string"
                    },
                    FOBVigente: {
                        type: "string"
                    },
                    PorcFOBVigente: {
                        type: "string"
                    },
                    FOBAnterior: {
                        type: "string"
                    },
                    PorcFOBAnterior: {
                        type: "string"
                    },
                    CIFVigente: {
                        type: "string"
                    },
                    PorcCIFVigente: {
                        type: "string"
                    },
                    CIFAnterior: {
                        type: "string"
                    },
                    PorcCIFAnterior: {
                        type: "string"
                    },
                }
            }
        },
        requestEnd: function (e) {
            //console.log("dsParticipacionAUSAyAgencias >> requestEnd");
        },
    });

    dsParticipacionAUSAyAgencias.fetch(function () {
        if (dsParticipacionAUSAyAgencias.total() > 0) {
            var view1 = dsParticipacionAUSAyAgencias.view();
            //console.log("view1 >> length: " + view1.length);
            //ParticipacionOtrasAgencias
            var strHTML = "";
            for (var i = 0; i < view1.length; i++) {
                //strHTML += "<dd> Agencias " + i + "</dd>"; 
                strHTML += "<dd><b>";
                strHTML += view1[i].Agente + "<br>";
                strHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Despacho (" + view1[i].PorcDespachosAnterior + "%)<br>";
                strHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CIF (" + view1[i].PorcCIFAnterior + "%)<br>";
                strHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FOB (" + view1[i].PorcFOBAnterior + "%)<br>";
                strHTML += "</b></dd>";
            }
            $("#ParticipacionOtrasAgencias").html(strHTML);

            //AUSA  ADUANAS S.A.
            dsParticipacionAUSAyAgencias.filter({
                field: "Agente",
                operator: "startswith",
                value: "AUSA"
            });
            var view2 = dsParticipacionAUSAyAgencias.view();
            //console.log("view2 >> length: " + view2.length);
            //console.log("view2 >> Agente: " + view2[0].Agente);
            //TODO-WIP IMPLEMENTS VISUAL ALERTS 
            $("#PorcDespachosVigentes").html(view2[0].PorcDespachosVigentes + "%");
            AlertaProcentageRangos(view2[0].PorcDespachosVigentes, "PorcDespachosVigentes");

            $("#PorcDespachosAnterior").html(view2[0].PorcDespachosAnterior + "%");
            AlertaProcentageRangos(view2[0].PorcDespachosAnterior, "PorcDespachosAnterior");

            $("#PorcFOBVigente").html(view2[0].PorcFOBVigente + "%");
            AlertaProcentageRangos(view2[0].PorcFOBVigente, "PorcFOBVigente");

            $("#PorcFOBAnterior").html(view2[0].PorcFOBAnterior + "%");
            AlertaProcentageRangos(view2[0].PorcFOBAnterior, "PorcFOBAnterior");

            $("#PorcCIFVigente").html(view2[0].PorcCIFVigente + "%");
            AlertaProcentageRangos(view2[0].PorcCIFVigente, "PorcCIFVigente");

            $("#PorcCIFAnterior").html(view2[0].PorcCIFAnterior + "%");
            AlertaProcentageRangos(view2[0].PorcCIFAnterior, "PorcCIFAnterior");

            $("#f01participacionAusa").show();
            $("#f01participacionOtros").show();

        } else {
            $("#f01participacionAusa").hide();
            $("#f01participacionOtros").hide();
            notificationWidget.show("No se encontró participación", "error");
        }

    });
    //PARTICIPACION AUSA Y OTRAS AGENCIAS END

    //INGRESO POR DESPACHO INGRESO ADUANAS CANTIDAD USOS AOL DEL MES START
    var dsIngresoDespachoAduanaUsoAOLMes = new kendo.data.DataSource({
        transport: {
            //Parametrizzare con ContactoID
            read: {
                url: WServ + "Clientes/participacion/" + ClienteID,
                dataType: "json"
            },
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        editable: false,
                        nullable: true,
                        type: "number"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    },
                    IPDmesVigente: {
                        type: "string"
                    },
                    IPDMesAnterior: {
                        type: "string"
                    },
                    IPDUltimos3Meses: {
                        type: "string"
                    },
                    AduanaIngresoMesVigente: {
                        type: "string"
                    },
                    AduanaIngresoMesAnterior: {
                        type: "string"
                    },
                    AduanaIngresoUltimos3Meses: {
                        type: "string"
                    },
                    HitsAOL: {
                        type: "string"
                    },
                }
            }
        },
        requestEnd: function (e) {
            //console.log("dsIngresoDespachoAduanaUsoAOLMes >> requestEnd");
        },
    });

    dsIngresoDespachoAduanaUsoAOLMes.fetch(function () {

        if (dsIngresoDespachoAduanaUsoAOLMes.total() > 0) {
            // id --> PartAduanaCierreMesAnterior
            // id --> PartAduanaAcumuladoMes
            // id --> PartAduanaAcumuladoTresMeses
            // id --> UsosAOLdelMes
            var data = this.data();
            $("#PartDespachoCierreMesAnterior").html("$" + data[0].IPDMesAnterior);
            $("#PartDespachoAcumuladoMes").html("$" + data[0].IPDmesVigente);
            $("#PartDespachoAcumuladoTresMeses").html("$" + data[0].IPDUltimos3Meses);
            $("#PartAduanaCierreMesAnterior").html("$" + data[0].AduanaIngresoMesAnterior);
            $("#PartAduanaAcumuladoMes").html("$" + data[0].AduanaIngresoMesVigente);
            $("#PartAduanaAcumuladoTresMeses").html("$" + data[0].AduanaIngresoUltimos3Meses);
            $("#UsosAOLdelMes").html(parseInt(data[0].HitsAOL));
            $("#f01ingresoPorDespacho").show();
            $("#f01ingresoAduanas").show();
        } else {
            $("#f01ingresoPorDespacho").hide();
            $("#f01ingresoAduanas").hide();
            $("#UsosAOLdelMes").html("");
            notificationWidget.show("No se encontró ingresos", "error");
        }
    });


    //INGRESO POR DESPACHO INGRESO ADUANAS CANTIDAD USOS AOL DEL MES END

    //CONDICIONES DE PAGO START
    var dsCondicionesDePago = new kendo.data.DataSource({
        transport: {
            //Parametrizzare con ContactoID
            read: {
                url: WServ + "Clientes/condpagoD/" + ClienteID,
                dataType: "json"
            },
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        editable: false,
                        nullable: true,
                        type: "number"
                    },
                    Compania: {
                        type: "string"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    },
                    LineaNegocio: {
                        type: "string"
                    },
                    Servicio: {
                        type: "string"
                    },
                    DiasPago: {
                        type: "string"
                    },
                    HastaMonto: {
                        type: "string"
                    },
                    Moneda: {
                        type: "string"
                    },
                    LineaCredito: {
                        type: "string"
                    },
                }
            }
        },
        requestEnd: function (e) {
            //console.log("dsCondicionesDePago >> requestEnd");
        },
    });

    dsCondicionesDePago.fetch(function () {

        if (dsCondicionesDePago.total() > 0) {
            var strHTMLCondicionesDePago = "";
            var data = this.data(); 
            
            $("#CondicionesDePago").html("");
            for (var i = 0; i < data.length; i++) {
                strHTMLCondicionesDePago += " </br>";
                strHTMLCondicionesDePago += "<div  class=\"row\">"
                strHTMLCondicionesDePago += "<div  class=\"col-xs-12\">"
                strHTMLCondicionesDePago += "<div class=\"btn btn-default btn-block font-boton b_color_1 tex_boton_2\" onclick=\"OpenModCondPago('" + data[i].Servicio
                strHTMLCondicionesDePago += "','" + data[i].DiasPago
                strHTMLCondicionesDePago += "','" + data[i].HastaMonto
                strHTMLCondicionesDePago += "','" + data[i].Moneda
                strHTMLCondicionesDePago += "','" + data[i].LineaCredito
                strHTMLCondicionesDePago += "','" + data[i].LineaNegocio
                strHTMLCondicionesDePago += "','" + data[i].Compania
                strHTMLCondicionesDePago += "');\"> ";
                strHTMLCondicionesDePago += " <b>";
                strHTMLCondicionesDePago += data[i].Servicio;
                strHTMLCondicionesDePago += " </b>";
                strHTMLCondicionesDePago += " </div>";
                strHTMLCondicionesDePago += " </div>";
                strHTMLCondicionesDePago += " </div>";
            }

            $("#CondicionesDePago").append(strHTMLCondicionesDePago);

            $("#f01condicionesDePago").show();
        } else {
            $("#f01condicionesDePago").hide();
            notificationWidget.show("No se encontró condiciónes de pago", "error");
        }


    });
    //CONDICIONES DE PAGO END

    //PARTICIPACION TARIFAS START
    var dsTarifas = new kendo.data.DataSource({
        transport: {
            //Parametrizzare con ContactoID
            read: {
                url: WServ + "Clientes/tarifas/" + ClienteID,
                dataType: "json"
            },
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        editable: false,
                        nullable: true,
                        type: "number"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    },
                    Servicio: {
                        type: "string"
                    },
                    Observacion: {
                        type: "string"
                    },
                }
            }
        },
        requestEnd: function (e) {
            //console.log("dsTarifas >> requestEnd");
        },
    });

    dsTarifas.fetch(function () {
        if (dsTarifas.total() > 0) {


            var strHTMLTarifas = "";
            var data = this.data();
            //console.log("dsTarifas.data() >> length: " + data.length);
  
            var myStr = "";
            $("#Tarifas").html("");
            for (var i = 0; i < data.length; i++) {

                myStr = data[i].Observacion;

                myStr = myStr.replace("\r\n", "\n");
                strHTMLTarifas += " </br>";
                strHTMLTarifas += "<div  class=\"row\">";
                strHTMLTarifas += "<div  class=\"col-xs-12\">";
                strHTMLTarifas += "<div class=\"btn btn-default btn-block font-boton b_color_1 tex_boton_2\" onclick=\"OpenModTarifas('" + data[i].Servicio;
                strHTMLTarifas += "','" + escape(myStr);
                strHTMLTarifas += "');\"> ";
                strHTMLTarifas += " <b>";
                strHTMLTarifas += data[i].Servicio;
                strHTMLTarifas += " </b>";
                strHTMLTarifas += " </div>";
                strHTMLTarifas += " </div>";
                strHTMLTarifas += " </div>";
            }

            $("#Tarifas").append(strHTMLTarifas);
            $("#f01tarifas").show();
        } else {
            $("#f01tarifas").hide();
            notificationWidget.show("No se encontró situación de pago", "error");
        }

    });
    //PARTICIPACION TARIFAS END
    window.location.href = "#det-cliente";

}

function cargaPrincipal() {
    //UsuarioID = "305";   
    var idsessionCl = sessionStorage.getItem("sessionUSER");
    var filtroCli = $("#filtroCliente").val();
    var dsCliente = new kendo.data.DataSource({
        transport: {
            // OK funziona, ottimizzare per grandi vol. di dati || paginazione
            // Parametrizzare la URL con una variabile idUsuario
            read: {
                url: WServ + "Clientes/carteraFiltro/",
                dataType: "json",
                type: "post",
                data: {
                    id: idsessionCl,
                    filtro: filtroCli
                }
            },
        },
        schema: {
            model: {
                id: "ClienteID",
                fields: {
                    ClienteID: {
                        editable: false,
                        nullable: true,
                        type: "number"
                    },
                    ClienteRazonSocial: {
                        type: "string"
                    },
                    FchModificacion: {
                        type: "date",
                        format: "{0:dd/MM/yyyy}"
                    }                    
                }
            }
        },
        requestStart: function (e) {
            kendo.ui.progress($("#ListaClientes"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#ListaClientes"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#ListaClientes"), false);
            alert("El Servicio no esta Disponible.");
        }

    });

    dsCliente.fetch(function () {
        if (dsCliente.total() > 0) {
            if ($("#lstCliente").data("kendoListView")) {
                $("#lstCliente").data("kendoListView").setDataSource(dsCliente);
            } else {
                $("#lstCliente").kendoListView({
                    dataSource: dsCliente,
                    template: kendo.template($("#tmpLstCliente").html()),
                    selectable: true,
                    change: MostraDetalleCliente
                });
            }
            $("#lstCliente").css("display", "block");
        } else {
            $("#lstCliente").css("display", "none");
            var notificationElement = $("#notification");
            notificationElement.kendoNotification();
            var notificationWidget = notificationElement.data("kendoNotification");
            notificationWidget.show("No se encontraron clientes con: " + $("#filtroCliente").val(), "error");
        }
    });
}



function AlertaProcentageRangos(valorIndicador, elementoAlerta) {
    //console.log("AlertaProcentageRangos >>> nivelAlerta: " + valorIndicador + " elementoAlerta: " + elementoAlerta);
    var colorAlerta = "";
    if (valorIndicador >= 100.00) {
        colorAlerta = "red";
    } else if (valorIndicador >= 80.00 && valorIndicador < 100.00) {
        colorAlerta = "orange";
    } else if (valorIndicador < 80.00) {
        colorAlerta = "green";
    }
    //$("#PorcDespachosVigentes").css("background-color","yellow");
    eval("$(\"#Alerta" + elementoAlerta + "\").css(\"background-color\",\"" + colorAlerta + "\");");
}

function OpenModCondPago(valServicio, valDiasPago, valHastaMonto, valMoneda, valLineaCredito, valLineaNegocio, valCompania) {
    $("#ModServicio").html(valServicio);
    $("#ModDiasPago").html(valDiasPago);
    $("#ModHastaMonto").html(valHastaMonto);
    $("#ModMoneda").html(valMoneda);
    $("#ModLineaCredito").html(valLineaCredito);
    $("#ModLineaNegocio").html(valLineaNegocio);
    $("#ModCompania").html(valCompania);

    $('#ModCondPago').data('kendoMobileModalView').open();
}

function OpenModTarifas(valServicio, valObservaciones) {

    //console.log("OpenModTarifasss >>> " + valServicio);
    $("#ModTarifasServicio").html(valServicio);
    $("#ModTarifasObservaciones").html(unescape(valObservaciones));
    $('#ModTarifas').data('kendoMobileModalView').open();
    $("#f01activarZoom").css("display", "block");

    //console.log("modal height: " + parseInt($('#ModTarifas').css('height')));
    //console.log("modal height: " + parseInt($('#f01HeaderModTarifas').css('height')));

    $("#ModTarifasObservaciones").css("height", parseInt($('#ModTarifas').css('height')) - parseInt($('#f01HeaderModTarifas').css('height')) + "px");
}

// INICIO CAMBIO POP-UP TARIFAS DE MOBILEMODALVIEW A WINDOW DE KENDO POST REUNION 28/XII/2015
function OpenModTarifas__NEW__(valServicio, valObservaciones) {
        $("#ModTarifas").kendoWindow({
            scrollable: true,
            modal: true,
            height: "90%",
            width: "90%",
            minWidth: 100,
            minHeight: 100,
            maxWidth: 400,
            maxHeight: 600,
            visible: false
        });
        $("#ModTarifas").data("kendoWindow").title(valServicio);
        $("#ModTarifas").data("kendoWindow").center();
        $("#ModTarifas").data("kendoWindow").open();
        $("#cuerpoModal").html(unescape(valObservaciones));
    }
    // FIN CAMBIO POP-UP TARIFAS DE MOBILEMODALVIEW A WINDOW DE KENDO 28/XII/2015

function GoToDetMorosidadUtilizacionLinea() {
    window.location.href = "#det-MorosidadUtilizacionLinea";
}

function MakeCall() {
    //Handle to Cordoba lib
    window.open('tel:' + $("#TelefonosContactoCliente").data("kendoDropDownList").dataItem().Numero, '_system')
}

// END_CUSTOM_CODE_funcionalidad01