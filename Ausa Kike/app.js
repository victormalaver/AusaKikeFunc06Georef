(function () {
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    //Commit sdfdf
    var app = {
        data: {}
    };

    var bootstrap = function () {
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {

                // comment out the following line to get a UI which matches the look
                // and feel of the operating system
                skin: 'flat',
                // the application needs to know which view to load first
                initial: 'components/homeView/view.html',
                statusBarStyle: 'black-translucent'
            });
        });
    };

    if (window.cordova) {
        // this function is called by Cordova when the application is loaded by the device
        document.addEventListener('deviceready', function () {
            // hide the splash screen as soon as the app is ready. otherwise
            // Cordova will wait 5 very long seconds to do it for you.
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            var element = document.getElementById('appDrawer');
            if (typeof (element) != 'undefined' && element != null) {
                if (window.navigator.msPointerEnabled) {
                    $("#navigation-container").on("MSPointerDown", "a", function (event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $("#navigation-container").on("touchstart", "a", function (event) {
                        app.keepActiveState($(this));
                    });
                }
            }

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $("#navigation-container li a.active").removeClass("active");
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

// START_CUSTOM_CODE_kendoUiMobileApp 

sessionStorage.sessionUSER = "SessionData";

/* servicio */
var WServ = "Data";
WServ = "http://www.ausa.com.pe/AppMovil_Valmar/";
//prueba
// END_CUSTOM_CODE_kendoUiMobileApp 

var CaptureF = 0;
var CaptureD = 0;
var monitor;

(function (g) {
	if (g._eqatecmonitor)
      return;
    try {
        // Create the monitor instance
        var settings = _eqatec.createSettings("10af9757618f4c3a90dc2850b8d148a5");
        settings.version = "1.0";
        monitor = g._eqatecmonitor = _eqatec.createMonitor(settings);
        // Start the monitor when your application starts
        monitor.start();
        console.log("Telerik Analytics Started");
    } catch (e) {
        console.log("Telerik Analytics exception: " + e.description);
    }
    
})(window);