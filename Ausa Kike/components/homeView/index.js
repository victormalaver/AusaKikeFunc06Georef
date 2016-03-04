'use strict';

app.homeView = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_homeView
var txtsUsuario = "";
var txtsContrasenia = "";
var dsLogin = null;
var DSroles, DSdatos, datos, dsRoles;

/*
DFC20160203 Parameters to manage the for position's capture Latitude and Logitude
using the navigator.geolocation.watchPosition(...) API
*/

var setIntervalID = null;
var isDepachador = false;
var onSuccessCount = 1;
var onErrorCount = 1;
var setIntervalCount = 1;

function CleanDS() {
    $("#txtsUsuario").val("");
    $("#txtsUsuario").html("");
    $("#txtsContrasenia").val("");
    $("#txtsContrasenia").html("");
}

function LoginDS() {
    /*
     * DATOS PRUEBAS
     * jlcornejo - 123
     * rmanrique - rm0112ue
     */
    txtsUsuario = $("#txtsUsuario").val();
    txtsContrasenia = $("#txtsContrasenia").val();

    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");

    if (isEmpty(txtsUsuario)) {
        notificationWidget.show("Ingrese el usuario", "error");
        return;
    }

    if (isEmpty(txtsContrasenia)) {
        notificationWidget.show("Ingrese la contraseña", "error");
        return;
    }

    dsLogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Inicio/AutentificaUsuario",
                dataType: "json",
                type: "post",
                data: {
                    txtsUsuario: txtsUsuario,
                    txtsContrasenia: txtsContrasenia
                }
            }
        },
        requestStart: function (e) {
            kendo.ui.progress($("#homeView"), true);
        },
        requestEnd: function (e) {
            kendo.ui.progress($("#homeView"), false);
        },
        error: function (e) {
            kendo.ui.progress($("#homeView"), false);
            alert("El Servicio no esta Disponible.");
        }
    });

    dsLogin.fetch(function () {
        var data = this.data();
        /*
         * --> 0 ERROR usuario autenticado correctamente
         * --> 1 ERROR usuario no autenticado
         */
        var resLogin = 1;
        resLogin = data[0].Ejecucion;

        if (resLogin === 0) {
            var userID = data[0].Id;

            DSdatos = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: WServ + "Usuarios/Datos/" + userID,
                        dataType: "json"
                    }
                }
            });

            DSdatos.fetch(function () {
                var data = this.data();
                //console.log("Log=>"+data[0].Column1);
                datos = data[0].Column1;
                $("#NombreUsuario").html("Usuario: " + datos);
                $("#fUsuario").html("Usuario: " + datos);
            });

            sessionStorage.setItem("sessionUSER", userID);

            /*Analytics*/
            try {
                monitor.trackFeature("IMEI."+device.uuid);
                console.log("uuid: " + device.uuid);
                console.log("model: " + device.model);
                console.log("platform: " + device.platform);
                console.log("cordova: " + device.cordova);
                console.log("version: " + device.version);
				monitor.trackFeature("Funcionalidades.Login");
                monitor.trackFeature("UsuariosLogeados." +userID);
                console.log("Telerik Analytics Funcionalidades.Login");
            } catch (e) {
                console.log("Telerik Analytics exception: " + e.description);
            }
            /*
            funciones para roles y mostrar ocultar segun sea el caso
            */
            validarRoles(userID, "block");

            $("#txtsUsuario").val("");
            $("#txtsUsuario").html("");
            $("#txtsContrasenia").val("");
            $("#txtsContrasenia").html("");

            $("#funSS").css("display", "none");
            $("#funCS").css("display", "block");
            $("#fUsuario").css("display", "block");

            window.location.href = "#AutenticacionOK";

        }

        if (resLogin === 1) {
            notificationWidget.show("Error de Autenticación", "error");
            notificationWidget.show("Usuario y/o Contraseña no son válidos", "error");
        }

    });
}

function validarRoles(id, visual) {

    if (id == "salida") {
        $("#fun01").css("display", visual);
        $("#fun02").css("display", visual);
        $("#fun03").css("display", visual);
        $("#fun04").css("display", visual);
        $("#fun05").css("display", visual);
        $("#fun06").css("display", visual);
        $("#fun07").css("display", visual);
        $("#fun08").css("display", visual);
    } else {

        dsRoles = new kendo.data.DataSource({
            transport: {
                read: {
                    url: WServ + "Usuarios/Roles/" + id,
                    dataType: "json"
                }
            }
        });

        dsRoles.fetch(function () {
            var data = this.data();
            for (var i = 0; i < dsRoles.total(); i++) {
                //console.log("Itera: "+i+" - Rol:"+data[i].Rol);
                switch (data[i].Rol) {
                    case "Datos del cliente": 
                        $("#fun01").css("display", visual);
                        $("#fun08").css("display", visual);
                        break;
                    case "Seguimiento despacho": 
                        $("#fun02").css("display", visual); 
                        break;
                    case "Tareas": 
                        $("#fun03").css("display", visual);
                        break;
                    case "Operaciones Coordinador": 
                        $("#fun05").css("display", visual);
                        $("#fun04").css("display", visual);
                        $("#fun06").css("display", visual);
                        break;
                    case "Operaciones Despachador": 
                        $("#fun05").css("display", visual);
                        CaptureD = 8;
                        CaptureF = 8;
                        isDepachador = true;
                        grabaPosDespachador();
                        setIntervalID = window.setInterval(
                            grabaPosDespachador,
                            // TUNE TO 1000 * 60 * 30 = 1 POS. BY HOUR FOR PRODUCTION RELEASE
                            30000 * 10
                        );
                        break;
                }
            }
        });
    }
}

function cerrarSesion() {
    validarRoles("salida", "none");
    $("#funSS").css("display", "block");
    $("#funCS").css("display", "none");
    $("#fUsuario").css("display", "none");
    sessionStorage.setItem("sessionUSER", "");
    window.location.href = "#homeView";
    onSuccessCount = 1;
    onErrorCount = 1;
    if (setIntervalID !== null) {
        clearInterval(setIntervalID);
        setIntervalCount = 1;
        //console.log("DFC >>> clearInterval > setIntervalID");
    }
    isDepachador = false;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}


//DFC20160201 Callbacks functions for capture events of navigator.geolocation.watchPosition(...) API

function onSuccessOpDespachador(position) {
    // console.log("DFC >>> evt onSuccessOpDespachador");
    $("#logWPOnSuccessCOUNT").html("> " + onSuccessCount + " UsrID: " + sessionStorage.sessionUSER);
    onSuccessCount = onSuccessCount + 1;
    $("#logWPOnSuccessLAT").html(position.coords.latitude.toPrecision(10));
    $("#logWPOnSuccessLNG").html(position.coords.longitude.toPrecision(10));
    // CODE REFACTORED --- MOVE FROM FUNCTION grabaPosDespachador() START
    var strForLog = "";
    var dsUbicDespachador = null;
    dsUbicDespachador = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/UbicacionInsertar",
                dataType: "json",
                type: "post",
                data: {
                    usuario: sessionStorage.sessionUSER,
                    latitud: $("#logWPOnSuccessLAT").html(),
                    longitud: $("#logWPOnSuccessLNG").html(),
                    operacion: 0,
                }
            }
        },
        requestStart: function (e) {
            //console.log("DFC >>> requestStart");
        },
        requestEnd: function (e) {
            //console.log("DFC >>> requestEnd");
        },
        error: function (e) {
            $("#logWPOnSuccessERRMSG").html(e);
            //alert("El Servicio no esta Disponible.");
        }
    });

    dsUbicDespachador.fetch(function () {
        /*
         * --> ERROR = 0 POS(LAT,LNG) grabada correttamente
         * --> ERROR = 1 POS(LAT,LNG) __NO__ grabada correttamente
         * --> *** TODO: ERROR = 2 fuera de tiempo para grabar POS(LAT,LNG) ***
         */
        var resUbicacionInsertar = 1;
        var data = this.data();
        resUbicacionInsertar = data[0].Ejecucion;
        if (resUbicacionInsertar === 0) {
            strForLog = strForLog + " POS. DESPACHADOR GRABADA CON WS";
            console.log(">>> " + strForLog);
        }
        if (resUbicacionInsertar === 1) {
            strForLog = strForLog + " ** ERROR WS ** POS. DESPACHADOR __NO__ GRABADA";
            console.log(">>> " + strForLog);
        }

        $("#logWPOnSuccessERRMSG").html("Ejecucion: " + data[0].Ejecucion);
    });
    // CODE REFACTORED --- MOVE FROM FUNCTION grabaPosDespachador() END
}

function onErrorOpDespachador(error) {
    // console.log("DFC >>> evt onErrorOpDespachador");
    $("#logWatchPositionOnError").html("> evt onError " + onErrorCount);
    onErrorCount = onErrorCount + 1;
    $("#logWPOnErrorCodeMsg").html("CODE: " + error.code + " MESSAGE: " + error.message);
}

function grabaPosDespachador() {
        var d = new Date();
        var strForLog = d.toLocaleTimeString();
        if (isDepachador == true) {
            // DFC20160216 Code for capture the Geolocation of Despachador Operaciones user
            navigator.geolocation.getCurrentPosition(
                onSuccessOpDespachador,
                onErrorOpDespachador,
                // DFC 20160208 ALWAYS __TURN_ON__ GPS FX ON MOBILE DEVICE or LOCATION FX ON PC IF EXISTS 
                // IF PC DOESN'T EXIXST LOCATION FX, THE CHROME SIMULATOR DOESN'T CAPTURE POS (LAT,LNG) 
                // SO COMMENT OUT THE OPTIONS OF navigator.geolocation.watchPosition(...) BELOW
                {
                    maximumAge: 3000,
                    timeout: 5000,
                    enableHighAccuracy: true
                }
            );

            strForLog = strForLog + " DESPACHADOR " + "LAT: " + $("#logWPOnSuccessLAT").html() + " LNG: " + $("#logWPOnSuccessLNG").html();
            $("#logSetIntLAT").html($("#logWPOnSuccessLAT").html());
            $("#logSetIntLNG").html($("#logWPOnSuccessLNG").html());
            $("#logSetIntTIMEOUT").html(d.getHours() + " : " + d.getMinutes() + " : " + d.getSeconds());
            $("#logSetIntCOUNT").html("> " + setIntervalCount);
            setIntervalCount = setIntervalCount + 1;

            strForLog = strForLog + " NUEVA POS. DESPACHADOR";
        } else {
            strForLog = strForLog + " NO USUARIO DESPACHADOR";
        }
        console.log(" grabaPosDespachador() >>> " + strForLog);
    }
    // END_CUSTOM_CODE_homeView