sap.ui.define([
    "ZTVBH/controller/BaseController",
    "ZTVBH/model/formatter"
], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("ZTVBH.controller.OrderDetail", {
        formatter : formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZTVBH.www.view.OrderDetail
		 */
        onInit: function() {
            this.Device = this.getDevice();
            this.getRouter().getRoute("OrderDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function(oEvent) {
            this.Vbeln = oEvent.getParameter("arguments").Vbeln;
            this.sPath = this.getModel().createKey("/OrderSet", {
                Vbeln: this.Vbeln
            });
            this.getView().bindElement({
                path: this.sPath
            });
        },
        onNavBack: function () {
            clearInterval(this.refresher);
            this.back();
        }
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZTVBH.www.view.OrderDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZTVBH.www.view.OrderDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZTVBH.www.view.OrderDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});