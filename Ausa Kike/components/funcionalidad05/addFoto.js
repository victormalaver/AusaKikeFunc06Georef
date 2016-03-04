$("#btnAddFoto").attr("onclick", "kendo.mobile.application.navigate('components/funcionalidad05/captureView.html');f05getImage();");
f05getImage();

function id(element) {
        return document.getElementById(element);
    }
    (function () {
        //Notificaciones
        var notificationElement = $("#notification");
        notificationElement.kendoNotification();
        var notificationWidget = notificationElement.data("kendoNotification");
        //End
        window.captureImageModel = kendo.observable({
            pictureSource: null,
            destinationType: null,
            capureImage: function (e) {
                var that = this;
                navigator.device.capture.captureImage(that.captureSuccess, that.captureError, {
                    limit: 1
                });
                //Codigo para eliminar el bug de la primera grabación (en la primera grabación no se guarda la ruta)
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.stopPropagation();
                //end
            },
            captureSuccess: function (capturedFiles) {
                var i, capturesMsg = "";
                for (i = 0; i < capturedFiles.length; i += 1) {
                    capturesMsg += capturedFiles[i].fullPath;
                }
                capturesMsg = capturesMsg.replace(/\%20/g, ' ');
                f05newImage(capturesMsg);
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.stopPropagation();
            },
            captureError: function (error) {
                if (window.navigator.simulator === true) {
                    notificationWidget.show("Capture error: " + error, "error");
                } else {
                    var media = document.getElementById("media");
                    media.innerHTML = "An error occured! Code:" + error.code;
                }
            },
        });

    }());

function playAudio(ID) {
    var src = document.getElementById("archivo" + ID).value;
    $("#f05imgShow").attr("src", src);

    $("#f05dialogImageView").kendoWindow({
        width: "80%",
        height: "75%",
        title: "",
        modal: true,
        scrollable: false,
        draggable: false,
        activate: function () {
            //determina longitud de la imagen para acomodarla
            var img = document.getElementById('f05imgShow');
            //console.log("ancho*alto: " + img.clientWidth + " - " + img.clientHeight);
            if (img.clientHeight < img.clientWidth) {
                //console.log("hori");
                $("#f05imgShow").attr("style", "height: 100%;");
            } else {
                //console.log("vert");
                $("#f05imgShow").attr("style", "width: 100%;");
            }
            $("#f05dialogImageView").data("kendoWindow").center();
            $("#f05dialogImageView_wnd_title").html('Imagen: ' + ID); //  '<a class="btn btn-default btn-xs pull-right"><i class="fa fa-trash-o text-muted"></i></a>' 
        },
        resize: function () {
            $("#f05dialogImageView").data("kendoWindow").center();
            $("#f05dialogImageView_wnd_title").html('Imagen: ' + ID); //  '<a class="btn btn-default btn-xs pull-right"><i class="fa fa-trash-o text-muted"></i></a>' 
        },
        close: function (e) {
            $("#f05dialogImageView").data("kendoWindow").restore();
        },
        actions: ["Maximize", "Close"]
    });
    $("#f05dialogImageView").data("kendoWindow").center();
    $("#f05dialogImageView_wnd_title").html('Imagen: ' + ID); //  '<a class="btn btn-default btn-xs pull-right"><i class="fa fa-trash-o text-muted"></i></a>' 

    $("#f05activarZoom").css("display", "block");
    $("#f05dialogImageView").data("kendoWindow").open();

}

function f05getImage() {
    var dsImage = new kendo.data.DataSource({
        transport: {
            read: {
                url: WServ + "Operaciones/ListarFotosOperaciones?idOperacion=" + f05NumOperacion,
                dataType: "json",
                type: "get",
                data: {
                    tipo: "1" // 1=fotos, 2=documentos
                }
            }
        }
    });

    dsImage.fetch(function () {
        $("#f05viewImage").kendoListView({
            dataSource: dsImage,
            template: kendo.template($("#f05TemLI").html())
        });
    });
}

function f05enviarBackend() {
    //Iteramos los audios grabados en la memoria de nuestros smartphone, para hacer la carga de audios en el backend services

    kendo.ui.progress($("#f05listaImage"), true);
    $("a[type='newImage']").each(function (index) {
        var fileToUpload = $(this).attr("value"); //capturedFiles[0].fullPath;
        upload(fileToUpload);
        $(this).parent().remove();
    });
    $("#f05btnSendBS").attr("disabled", "disabled");
}

function upload(fileToUpload) {

    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End

    var apiKey = "80i2xn90wysdmolz";
    var el = new Everlive(apiKey);
    var options = {
        fileName: 'myImagen.png',
        mimeType: ' image/png'
    };
    el.files.upload(fileToUpload, options).then(function (r) {
            var uploadResultArray = JSON.parse(r.response).Result;
            var uploadedFileId = uploadResultArray[0].Id;
            var uploadedFileUri = uploadResultArray[0].Uri;
            uploadedFileUri = uploadedFileUri.replace("https", "http");
            var newArchive = {
                Name: "MyArchive",
                FileUri: uploadedFileUri,
                FileId: uploadedFileId
            };
            el.data("Archivos").create(newArchive, function (data) {
                f05accionImage("insert", uploadedFileUri, "", data.result.Id);
            }, function (err) {
                notificationWidget.show("Error al subir el archivo al backend service: " + JSON.stringify(err), "error");
            });
        },
        function (uploadError) {
            notificationWidget.show("Upload error: " + JSON.stringify(uploadError), "error");
        });
}
var toquen = 0;

function f05newImage(archivo) {
        toquen = toquen + 1;
        var idnota = "local" + toquen;
        $("#f05newImage").append('<button type="button" class="list-group-item" id="btn' + idnota + '"><a class="btn btn-default btn-xs" type="newImage" value="' + archivo + '"><i class="fa fa-trash-o text-muted"></i></a>&nbsp&nbsp&nbsp<i class="fa fa-hdd-o text-muted"></i> Nueva Imagen: ' + idnota + '<tag id="divAccion' + idnota + '" type="divIsPlay" align="center"></tag><span style="float:right"><input value="' + archivo + '" id="archivo' + idnota + '" type="hidden"></input><a class="btn btn-info btn-xs" onclick="playAudio(' + "'" + idnota + "'" + ')"><i id="iconBtn' + idnota + '" type="iconBtn" class="fa fa-eye"></i></a></span></button>');

        $("#f05btnSendBS").removeAttr("disabled");
    }
    //Delete new audio
$(document).on("click", "a[type='newImage']", function () {
    var idimage = $(this).parent().attr("id").replace("btn", "");

    $("#f05dialogImage").kendoWindow({
        title: "Confirmación",
        scrollable: false,
        modal: true,
        visible: false,
        activate: function () {
            $("#f05dialogImage").data("kendoWindow").center();
        }
    });
    $("#f05dialogImage").data("kendoWindow").center();

    $("#f05dialogImage").data("kendoWindow").open();
    $("#f05divMensajeConf").text("¿Desea eliminar la imagen " + idimage + " de la operación?");

    $("#f05accionImage").attr('onclick', 'f05deleteImage( idimage )');
});

function f05deleteImage(idImage) {
    if ($.isNumeric(idImage)) {
        $("#f05dialogImage").kendoWindow({
            title: "Confirmación",
            scrollable: false,
            modal: true,
            visible: false,
            activate: function () {
                $("#f05dialogImage").data("kendoWindow").center();
            }
        });
        $("#f05dialogImage").data("kendoWindow").center();
        $("#f05dialogImage").data("kendoWindow").open();
        $("#f05divMensajeConf").text("¿Desea eliminar la imagen " + idImage + " de la operación?");
        $("#f05accionImage").attr('onclick', 'f05accionImage("ndelete","",' + idImage + ',"")');
    } else {
        $('#f05dialogImage').data('kendoWindow').close();
        $("#btn" + idImage).remove();
        if ($('a[type="newImage"]').length == 0) {
            $("#f05btnSendBS").attr("disabled", "disabled");
        }
    }
}

function f05accionImage(accion, FileUri, idAudio, idAudioBackend) {

    var txtidUsuario = sessionStorage.getItem("sessionUSER");
    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End
    var d = new Date,
        FReg = [d.getMonth() + 1,
            d.getDate(),
            d.getFullYear()].join('') + [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join('');
    accion == "insert" && $.ajax({
        type: "POST",
        url: WServ + 'Operaciones/InsertarTareaFotos',
        data: {
            archivo: "Foto" + FReg,
            usuario: txtidUsuario,
            operacion: f05NumOperacion.toString(), //$('#f05txtid').val()
            tipo: "1", // 1=fotos, 2=documentos
            ruta: FileUri
        },
        async: false,
        success: function (datos) {

            //ajax para descargar, guardar en servidor y para actualizar el url en server ausa
            var data = [];
            data = JSON.parse(datos);

            var idNew = data[0].Column1;
            if (data[0].Column1 > 0) {
                $.ajax({
                    type: "POST",
                    url: WServ + "Upload/UploadUrl",
                    data: {
                        id: idNew,
                        url: FileUri,
                        tipo: "2", //1=audios, 2= fotos, 3 documentos
                        subPath: f05Orden //Se cambió a numero de orden
                    },
                    async: false,
                    success: function (datos) {
                        kendo.ui.progress($("#f05listaImage"), false);
                        if (parseInt(datos) == 0) {
                            notificationWidget.show("Se insertó correctamente la imagen: " + idNew, "success");

                            //Para borrar del backend service
                            var el = new Everlive('80i2xn90wysdmolz');
                            var data = el.data('Archivos');
                            data.destroySingle({
                                    Id: idAudioBackend
                                },
                                function () {
                                    //notificationWidget.show("Eliminado correctamente del backend service", "success");
                                },
                                function (error) {
                                    notificationWidget.show("No se eliminó del Backend Service: " + JSON.stringify(error), "error");
                                }
                            );
                        } else {
                            notificationWidget.show("No se realizó correctamente el upload", "error");
                            kendo.ui.progress($("#f05listaImage"), false);
                        };
                    },
                    error: function () {
                        kendo.ui.progress($("#f05listaImage"), false);
                        notificationWidget.show("El servicio no está disponible", "error");
                    }
                });
            } else {
                notificationWidget.show("Id de operación no existe", "error");
                kendo.ui.progress($("#f05listaImage"), false);
            }
        },
        error: function () {
            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
        }
    });
    accion == "ndelete" && $.ajax({
        type: "POST",
        url: WServ + 'Operaciones/EliminarFotosOperaciones',
        data: {
            idDigitalizacion: idAudio
        },
        async: false,
        success: function (datos) {
            var data = [];
            data = JSON.parse(datos);
            if (data[0].Ejecucion == 0) {
                $('#f05dialogImage').data('kendoWindow').close();
                notificationWidget.show("Se eliminó la imagen " + idAudio + " de la operación", "success");
                // if ($("#f05reUpload" + idAudio)) {
                // if ($("a[onclick='f05reUpload " + idAudio + "']")) {
                if ($("#f05reUpload" + idAudio).length) {
                    //Para borrar del backend service
                    var el = new Everlive('80i2xn90wysdmolz');
                    var data = el.data('Archivos');
                    data.destroySingle({
                            Id: idAudioBackend
                        },
                        function () {
                            notificationWidget.show("Eliminado correctamente del backend service", "success");
                        },
                        function (error) {
                            notificationWidget.show("No se eliminó del Backend Service: " + JSON.stringify(error), "error");
                        }
                    );

                }
            } else {
                notificationWidget.show("No se eliminó la imagen correctamente", "error");
            }
        },
        error: function () {
            notificationWidget.show("No se puede establecer la conexión al servicio", "error");
        }
    });
    $('#f05viewImage').data('kendoListView').dataSource.read();
    $('#f05viewImage').data('kendoListView').refresh();


}


function f05escribirAusa(id, url, f05Orden, nombre) {
    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End
    $.ajax({
        type: "POST",
        url: WServ + "Upload/UploadUrl",
        data: {
            id: id.toString(),
            url: url,
            tipo: "2", //1=audios, 2= fotos, 3 documentos
            subPath: f05Orden //Se cambió a numero de orden
        },
        beforeSend: function () {
            // setting a timeout
            kendo.ui.progress($("#f05div" + id), true);
        },
        error: function (xhr) { // if error occured
            notificationWidget.show("El servicio no está disponible", "error");
        },
        complete: function () {
            kendo.ui.progress($("#f05div" + id), false);
        }
    }).done(function (datos) {
        if (parseInt(datos) == 0) {
            $('#f05viewImage').data('kendoListView').dataSource.read();
            $('#f05viewImage').data('kendoListView').refresh();
            notificationWidget.show("Se insertó correctamente la imagen: " + id, "success");

            f05eliminarEverlive(nombre);
        } else {
            notificationWidget.show("No se realizó correctamente el upload", "error");
        };
    });
}

function f05eliminarEverlive(idAudioBackend) {
    //Notificaciones
    var notificationElement = $("#notification");
    notificationElement.kendoNotification();
    var notificationWidget = notificationElement.data("kendoNotification");
    //End

    //Para borrar del backend service
    var el = new Everlive('80i2xn90wysdmolz');
    var data = el.data('Archivos');
    data.destroySingle({
            Id: idAudioBackend
        },
        function () {
            //notificationWidget.show("Eliminado correctamente del backend service", "success");
        },
        function (error) {
            notificationWidget.show("No se eliminó del Backend Service: " + JSON.stringify(error), "error");
        }
    );
}

function f05reUpload(Id) {
    var url = document.getElementById("archivo" + Id).value;
    var nombre = url.replace(/^.*[\\\/]/, '');
    f05escribirAusa(Id, url, f05Orden, nombre); //id del bs, url del bs    
}