sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "ZTVBH/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, Device, models, JSONModel, MessageToast) {
    "use strict";   //cú pháp chặt chẽ

    return UIComponent.extend("ZTVBH.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            var lblHome = this.getModel("i18n").getResourceBundle().getText("navToHome");
            var globalModel = new JSONModel({
                "user": "",
                "name": "",
                "token": "none",
                "AssignedSite": "",
                "SiteDesc" : "",
                "appTitle": lblHome,
                "appTitleIcon": "sap-icon://home"
            });
            var CartModel = new JSONModel({
                "salePerson": "",
                "TransactionType": "SALE",
                "TotalQuantity": 0,
                "CustomerId": "",
                "CustomerName": "",
                "Mobile": "",
                "Cslab": "",
                "ShippingMethod": "In-Store",
                "ShippingAddress": "",
                "ShipDate": null,
                "ShipTime": null,
                "DeliveryNotes": "",
                "CartItems": []
            });
            this.setModel(globalModel, "globalProperties");
            this.setModel(CartModel, "CartProperties");
            this.getRouter().getTargetHandler().setCloseDialogs(false);
            this.getModel().attachRequestFailed(this.requestFailed, this);
            this.getRouter().initialize();
            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            var model = this.getModel();
            model.attachRequestSent(this.setTimeout, this);
        },
        requestFailed: function (oEvent) {

        },
        setTimeout: function (oEvent) {
            // console.log(oEvent);
        },
        createContent: function () {
            var r = UIComponent.prototype.createContent.apply(this, arguments);
            // r.addStyleClass(this.getContentDensityClass());
            r.addStyleClass("sapUiSizeCozy");
            return r;
        }, getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                if (Device.system.desktop) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });

});