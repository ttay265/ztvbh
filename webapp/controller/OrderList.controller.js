sap.ui.define([
    "ZTVBH/controller/BaseController",
    "ZTVBH/model/formatter"
], function (BaseController, formatter) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.OrderList", {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.www.view.OrderList
         */
        onInit: function () {
            //Global variable
            this.ListOrder = this.byId("_listOrder");
            //Get current date
            var today = new Date();
            var fromDate = this.byId("__fromDate");
            var toDate = this.byId("__toDate");
            fromDate.setDateValue(today);
            toDate.setDateValue(today);
            //Call function default filter by (PERNR, VKORG)
            this.Pernr = this.getGlobalModel().getProperty("/user");
            this.initializationFilter(this.Pernr, this.Vkorg);
            this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function () {
            if (!this.checkLogin()) {
                this.getRouter().navTo("login", true);
            }
            else {
                this.Pernr = this.getGlobalModel().getProperty("/user");
                this.Vkorg = this.getGlobalModel().getProperty("/AssignedSite");
                var status = this.getGlobalModel().getProperty("/status");
                if (status === "N") {
                    this.forceChangePass();
                }
            }
        },
        //Get default SALE ORDER by user login infomation
        initializationFilter: function (Pernr, Vkorg) {
            this.wdItemTemplate = this.byId("_OrdersTemp").clone();
            //Get current date value
            var fromDate = this.byId("__fromDate").getDateValue();
            var toDate = this.byId("__toDate").getDateValue();
            fromDate.setHours(7);
            toDate.setHours(7);

            this.defaultFilters = [];
            //Current Date filter
            var btDateFilter = new sap.ui.model.Filter({
                path: "Audat",
                operator: "BT",
                value1: fromDate,
                value2: toDate
            });
            this.defaultFilters.push(btDateFilter);
            //Pernr filter parameters
            var pernrFilter = new sap.ui.model.Filter({
                path: "Pernr",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: Pernr
            });
            this.defaultFilters.push(pernrFilter);
            //Vkorg filter parameters
            // var pernrFilter = new sap.ui.model.Filter({
            //     path: "Vkorg",
            //     operator: sap.ui.model.FilterOperator.EQ,
            //     value1: Vkorg
            // });
            // this.defaultFilters.push(pernrFilter);
            //Binding items
            this.ListOrder.bindItems({
                path: "/OrderSet",
                template: this.wdItemTemplate,
                filters: this.defaultFilters,
                events: {
                    dataReceived: this._onModelBindCompleted.bind(this)
                }
            });
        },
        _onModelBindCompleted: function () {
            this.getView().setBusy(false);
        },
        _doFilter: function () {
            var fromDate = this.byId("__fromDate").getDateValue();
            var toDate = this.byId("__toDate").getDateValue();
            fromDate.setHours(7);
            toDate.setHours(7);
            this.wdItemTemplate = this.byId("_OrdersTemp").clone();
            //Get current date value
            this.defaultFilters = [];
            //Current Date filter
            var btDateFilter = new sap.ui.model.Filter({
                path: "Audat",
                operator: "BT",
                value1: fromDate,
                value2: toDate
            });
            this.defaultFilters.push(btDateFilter);
            //Pernr filter parameters
            var pernrFilter = new sap.ui.model.Filter({
                path: "Pernr",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: this.Pernr
            });
            this.defaultFilters.push(pernrFilter);
            //Binding items
            this.ListOrder.bindItems({
                path: "/OrderSet",
                template: this.wdItemTemplate,
                filters: this.defaultFilters,
                events: {
                    dataReceived: this._onModelBindCompleted.bind(this)
                }
            });
        },
        _onOrderPress: function (oEvent) {
            var Vbeln = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Vbeln");
            if (Vbeln) {
                this.getRouter().navTo(
                    "OrderDetail",
                    {
                        "Vbeln": Vbeln
                    },
                    false);
            }
        },
        onNavBack: function () {
            clearInterval(this.refresher);
            this.back();
        }
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf ZTVBH.www.view.OrderList
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf ZTVBH.www.view.OrderList
         */
        //	onAfterRendering: function() {
        //
        //	},

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ZTVBH.www.view.OrderList
         */
        //	onExit: function() {
        //
        //	}

    });

});