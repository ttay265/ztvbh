sap.ui.define([
    "ZTVBH/controller/BaseController",
    "ZTVBH/model/formatter"
], function (BaseController, formatter) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.SaleIncomeItem", {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.www.view.SaleIncomeItem
         */
        onInit: function () {
            this.saleIncomeList = this.byId("_listSaleIncome");
            this.Device = this.getDevice();
            this.getRouter().getRoute("saleIncomeDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            this.Pernr = this.getGlobalModel().getProperty("/user");
            this.Vbeln = oEvent.getParameter("arguments").Vbeln;
            if (!this.Pernr) {
                this.getRouter().navTo("login", true);
            } else {
                this.sPath = this.getModel().createKey("/SaleIncomeSet", {
                    Vbeln: this.Vbeln
                });
                this.getView().bindElement({
                    path: this.sPath
                });
            }
        },
        onNavBack: function () {
            clearInterval(this.refresher);
            this.back();
            // this.getRouter().navTo("saleIncome", false);
        }
    });

});