sap.ui.define([
    "ZTVBH/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.SaleIncomeMaster", {

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.www.view.SaleIncomeMaster
         */
        onInit: function () {
            var today = new Date();
            var fromDate = this.byId("__fromDate");
            var toDate = this.byId("__toDate");
            fromDate.setDateValue(today);
            toDate.setDateValue(today);
            this.txtTotalAmount = this.byId("txtTotalAmount");
            this.Device = this.getDevice();
            this.saleIncomeList = this.byId("_listSaleIncome");
            this.wdItemTemplate = this.byId("SaleIncomeMaster").clone();
            this.Pernr = this.getGlobalModel().getProperty("/user");
            this.getRouter().getRoute("saleIncomeMaster").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("home").attachPatternMatched(this.initLoad, this);
        },
        _onObjectMatched: function () {
            var Pernr = this.getGlobalModel().getProperty("/user");
            if (!Pernr) {
                this.getRouter().navTo("login", true);
            }
            this._doDateFilter();
        },
        initLoad: function () {
            this.getView().rerender();
            var today = new Date();
            var fromDate = this.byId("__fromDate");
            var toDate = this.byId("__toDate");
            fromDate.setDateValue(today);
            toDate.setDateValue(today);
            this.txtTotalAmount.setValue(0);
            this.txtTotalAmount.setCurrency("đ");
            // this._doDateFilter();
        },
        _onModelBindCompleted: function () {
            this.doSumTotalAmount();
            this.getView().setBusy(false);
        },
        doSumTotalAmount: function () {
            var s = new sap.ui.model.type.Currency();
            s.formatValue();
            var i, sum = 0,
                line, currency;
            var items = this.saleIncomeList.getItems();
            for (i = 0; i < items.length; i++) {
                line = items[i].getBindingContext().getProperty("Netwr");
                currency = items[i].getBindingContext().getProperty("Waerk");
                sum += parseInt(line);
                if (sum > 0) {
                    this.txtTotalAmount.setValue(parseFloat(sum));
                }
                this.txtTotalAmount.setCurrency(currency);
            }
        },
        _doDateFilter: function () {
            var Pernr = this.getGlobalModel().getProperty("/user");
            var fromDate = this.byId("__fromDate").getDateValue();
            var toDate = this.byId("__toDate").getDateValue();
            fromDate.setHours(7);
            toDate.setHours(7);
            this.defaultFilters = [];

            var pernrFilter = new sap.ui.model.Filter({
                path: "Pernr",
                operator: "EQ",
                value1: Pernr
            });
            this.defaultFilters.push(pernrFilter);

            if (fromDate && toDate) {
                var btDateFilter = new sap.ui.model.Filter({
                    path: "Audat",
                    operator: "BT",
                    value1: fromDate,
                    value2: toDate
                });
                this.defaultFilters.push(btDateFilter);
            } else if (fromDate) {
                var fromDateFilter = new sap.ui.model.Filter({
                    path: "Audat",
                    operator: "GE",
                    value1: fromDate
                });
                this.defaultFilters.push(fromDateFilter);
            } else if (toDate) {
                var toDateFilter = new sap.ui.model.Filter({
                    path: "Audat",
                    operator: "LE",
                    value1: toDate
                });
                this.defaultFilters.push(toDateFilter);
            }
            this.saleIncomeList.bindItems({
                path: "/SaleIncomeMasterSet",
                template: this.wdItemTemplate,
                filters: this.defaultFilters,
                events: {
                    dataReceived: this._onModelBindCompleted.bind(this)
                }
            });
        },
        navToOrders: function (oEvent) {
            var selectedDate = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Audat");
            var currentDate = selectedDate.toDateString();
            this.getRouter().navTo(
                "saleIncome",
                {
                    Audat: currentDate
                },
                false);
        }

    });

});