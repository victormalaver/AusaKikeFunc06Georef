'use strict';

app.funcionalidad06 = kendo.observable({
    onShow: function () {},
    afterShow: function () {
        getListaDespachadores();

    }
});

// START_CUSTOM_CODE_funcionalidad06
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

//getListaDespachadores -> datos del select tipo de tarea
function getListaDespachadores() {
    $("#txtIdDespachadorF06").kendoDropDownList({
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
    });
    var currentDate = new Date();
    var timezoneOffset = currentDate.getTimezoneOffset() * 60 * 1000;
    var localDate = new Date(currentDate.getTime() - timezoneOffset);

    var localDateISOString = localDate.toISOString().substr(0, 16);
    $("#f06Desde").val(localDateISOString);
    $("#f06Hasta").val(localDateISOString);

}


function cargaPosAlmacenesDespachador() {
    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End

    var valido = true;
    $('#f06Desde, #f06Hasta').parent().parent().removeClass("has-error");
    $('.k-multiselect-wrap.k-floatwrap').css("border-color", "#ccc");
    var txtidc = $("#txtidc").data("kendoMultiSelect");
    if ($('#f06Hasta').val() == "") {
        $('#f06Hasta').parent().parent().addClass("has-error");
        notificationWidget.show("Fecha de fin incorrecta", "error");
        valido = false;
    }
    if ($('#f06Desde').val() == "") {
        $('#f06Desde').parent().parent().addClass("has-error");
        notificationWidget.show("Fecha de inicio incorrecta", "error");
        valido = false;
    }

    var dropdownlist = $("#txtIdDespachadorF06").data("kendoDropDownList");
    if (dropdownlist.selectedIndex == -1) {
        notificationWidget.show("Seleccione un despachador", "error");
        valido = false;
    }
    if (valido == false) {
        return;
    }
    var idDespachador = dropdownlist.dataItem().idDespachador;
    $("#nombreDespachador").html(dropdownlist.dataItem().nomDespachador);

    var fechaIniDateParts = $("#f06Desde").val().split("T");
    fechaIniDateParts[0] = fechaIniDateParts[0].replace(/-/g, "/"); // formato date yyyy/mm/dd
    var strFechaIniDateParts = fechaIniDateParts[0] + " " + fechaIniDateParts[1] + ":00";
    var fechaFinDateParts = $("#f06Hasta").val().split("T");
    fechaFinDateParts[0] = fechaFinDateParts[0].replace(/-/g, "/"); // formato date yyyy/mm/dd
    var strFechaFinDateParts = fechaFinDateParts[0] + " " + fechaFinDateParts[1] + ":00";


    $("#map").remove();
    var alto = parseInt($("#funcionalidad06").css("height")) - 120;
    var div = $("<div id='map' style='width:100%;height:" + alto + "px;' ></div>").text("");
    $(".f6-info").after(div);

    //<![CDATA[

    var map = new L.map('map', {
        center: [-12.11391, -77.03933],
        zoom: 10,
    });

    L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
        //attribution: "Map: Tiles Courtesy of MapQuest (OpenStreetMap, CC-BY-SA)",
        subdomains: ["otile1", "otile2", "otile3", "otile4"],
        // maxZoom: 12,
        // minZoom: 2
    }).addTo(map);


    var markers = new L.MarkerClusterGroup();
    //markers.addLayer(new L.Marker([1, 1]));

    markers.addTo(map);


    var iconAlmacen = L.icon({
        iconUrl: 'components/funcionalidad06/almacen.png',
        // iconRetinaUrl: 'my-icon@2x.png',
        // iconSize: [38, 95], 
        iconAnchor: [15, 38], //X,Y
        popupAnchor: [0, -35],
        // // shadowUrl: 'my-icon-shadow.png',
        // shadowRetinaUrl: 'my-icon-shadow@2x.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });

    var iconDespachador = L.icon({
        iconUrl: 'components/funcionalidad06/despachador.png',
        // iconRetinaUrl: 'my-icon@2x.png',
        // iconSize: [38, 95],
        iconAnchor: [15, 38], //X,Y
        popupAnchor: [0, -35],
        // // shadowUrl: 'my-icon-shadow.png',
        // shadowRetinaUrl: 'my-icon-shadow@2x.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });

    var ubicDespachador = [];
    $.ajax({
        url: WServ + "Operaciones/UbicacionListar",
        type: "post",
        data: {
            usuario: idDespachador,
            fechaIni: strFechaIniDateParts,
            fechaFin: strFechaFinDateParts,
        },
        async: false,
        success: function (datos) {
            ubicDespachador = datos;
        },
        error: function () {
			notificationWidget.show("Error al consultar los despachadores", "error");
        }
    });




    if (ubicDespachador.length > 0) {
        for (var i = 0; i < ubicDespachador.length; i++) {
            // console.log(ubicDespachador[i].Info);
            // console.log(ubicDespachador[i].Fecha);
            // console.log(ubicDespachador[i].LatLong);
            // console.log(ubicDespachador[i].Operacion);
            markers.addLayer(new L.Marker(ubicDespachador[i].LatLong, {
                icon: iconDespachador
            }).bindPopup(ubicDespachador[i].Info));
            
            $("#ultimaUbicacionYHora").html(ubicDespachador[0].Fecha);
        }
    } else {
        notificationWidget.show("Despachador sin ubicaciones", "error");
        $("#ultimaUbicacionYHora").html("N/A");
    }



    var ubicAlmacen = [];
    $.ajax({
        //url: "http://54.213.238.161/wsAusa/Operaciones/AlmacenesListar",
        url: WServ + "Operaciones/AlmacenesListar",
        type: "post",
        data: {
            usuario: idDespachador,
            fechaIni: strFechaIniDateParts,
            fechaFin: strFechaFinDateParts,
        },
        async: false,
        success: function (datos) {
            ubicAlmacen = datos;
        },
        error: function () {
			notificationWidget.show("Error al consultar los almacenes", "error");
        }
    });

    if (ubicAlmacen.length > 0) {
        for (var i = 0; i < ubicAlmacen.length; i++) {
            // console.log(ubicDespachador[i].AlmDescripcion);
            // console.log(ubicDespachador[i].AlmDireccion);
            // console.log(ubicDespachador[i].AlmID);
            // console.log(ubicDespachador[i].InfoAlmacen);
            // console.log(ubicDespachador[i].LatLong);
            markers.addLayer(new L.Marker(ubicAlmacen[i].LatLong, {
                icon: iconAlmacen
            }).bindPopup(ubicAlmacen[i].InfoAlmacen));
        }

    } else {
        notificationWidget.show("No se encontraron almacenes", "error");
    }

    L.DomEvent.on(L.DomUtil.get('f06cargarPuntos'), 'click', function () {
        map.addLayer(markers);
    });
    $("#controlesMapa").slideToggle("slow");
}

function resetParametros() {
    $("#nombreDespachador").html("N/A");
    $("#ultimaUbicacionYHora").html("N/A");
    $("#map").hide("slow");
}

function opcionesCargaMapa() {
    $("#controlesMapa").slideToggle("slow");
}

// END_CUSTOM_CODE_funcionalidad06