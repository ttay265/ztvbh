sap.ui.define([
    "ZTVBH/controller/BaseController",
    "ZTVBH/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
], function (BaseController, formatter, Filter, JSONModel) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.SaleIncome", {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.www.view.SaleIncome
         */
        onInit: function () {
            var today = new Date();
            this.createModel("page");
            this.wdItemTemplate = this.byId("SaleIncomeSet").clone();
            this.txtTotalAmount = this.byId("txtTotalAmount");
            this.Device = this.getDevice();
            this.saleIncomeList = this.byId("_listSaleIncome");
            this.getRouter().getRoute("saleIncome").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function (oEvent) {
            this.Pernr = this.getGlobalModel().getProperty("/user");
            if (!this.Pernr) {
                this.getRouter().navTo("login", true);
            } else {
                this.Audat = oEvent.getParameter("arguments").Audat;
                // Set page Title as Current Date
                var currentDate = new Date(this.Audat);
                var label = this.getResourceBundle().getText("DATE");
                var title = label + " " + currentDate.getDate() + "/" + ( currentDate.getMonth() + 1 ) + "/" + currentDate.getFullYear();
                this.getModel("page").setProperty("/title", title);
                this.defaultFilter(this.Pernr, this.Audat);
            }
        },
        _onModelBindCompleted: function () {
            var s = new sap.ui.model.type.Currency();
            s.formatValue();
            var i, sum = 0,
                line, currency;
            // Update 16.07.2018
            var saleTyp = "", amountValue = 0;

            var items = this.saleIncomeList.getItems();
            for (i = 0; i < items.length; i++) {
                saleTyp = items[i].getBindingContext().getProperty("Auart");
                //Truong hop tra hang * (-1)
                if(saleTyp === 'ZRE1' || saleTyp === 'ZRE2' ){
                    amountValue = items[i].getBindingContext().getProperty("Netwr") * (-1);
                }else{
                    amountValue = items[i].getBindingContext().getProperty("Netwr");
                }
                // line = items[i].getBindingContext().getProperty("Netwr");
                currency = items[i].getBindingContext().getProperty("Waerk");
                sum += parseInt(amountValue);
                if (sum > 0) {
                    this.txtTotalAmount.setValue(parseFloat(sum));
                }
                this.txtTotalAmount.setCurrency(currency);
            }
            this.getView().setBusy(false);
        },
        _saleIncomeItemPress: function (oEvent) {
            var Vbeln = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Vbeln");
            this.getRouter().navTo(
                "saleIncomeDetail",
                {
                    "Vbeln": Vbeln
                },
                false);
        },
        defaultFilter: function (Pernr, audat) {
            var defaultFilter = [];
            var pernrFilter = new Filter({
                path: "Pernr",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: Pernr
            });
            defaultFilter.push(pernrFilter);
            var audat = new Date(audat);
            audat.setHours(7);
            this.defaultFilters = [];
            var btDateFilter = new Filter({
                path: "Audat",
                operator: "EQ",
                value1: audat
            });
            defaultFilter.push(btDateFilter);
            this.saleIncomeList.bindItems({
                path: "/SaleIncomeSet",
                template: this.wdItemTemplate,
                filters: defaultFilter,
                events: {
                    dataReceived: this._onModelBindCompleted.bind(this)
                }
            });
        },
        onNavBack: function () {
            clearInterval(this.refresher);
            this.back();
        }

    });

});