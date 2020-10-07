sap.ui.define([
    "ZTVBH/controller/BaseController"
], function (BaseController) {
    "use strict";
    return {
        StockingText: function (toStock) {
        },
        isSaleAvailable: function () {
            var cartItems = this.getCartModel().getProperty("/CartItems");
            var assignedSite = this.getGlobalModel().getProperty("/AssignedSite");
            for (var i = 0; i < cartItems.length; i++) {
                if (cartItems[i].Site !== assignedSite) {
                    return false;
                }
            }
            return true;
        },
        CartTotalQuantity: function (CartItems) {
            CartItems.forEach(function (item, index) {
            });
        },
        DeliveryStatusState: function (DlvStatus) {
            switch (DlvStatus) {
                case " ":
                    return "None";
                case "A":
                    return "Error";
                case "B":
                    return "Warning";
                case "C":
                    return "Success";
            }
        },

        AddressText: function (address) {
            if (address) {
                var addressObj = JSON.parse(address);
                return addressObj.fullAdd;
            }
            return this.getResourceBundle().getText("LBL_CUSTOMER_NO_ADDRESS");
        },

        price: function (sValue) {
            var numberFormat = sValue.getFloatInstance({
                maxFractionDigits: 2,
                minFractionDigits: 2,
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ","
            });
            return numberFormat.format(sValue);
        },

        lineCondition: function (shippingMethod) {
            var condition;
            if (this.getCartModel().getProperty("/TransactionType") === "SALE") {
                if (!shippingMethod) {
                    condition = this.getCartModel().getProperty("/ShippingMethod");
                } else {
                    condition = shippingMethod;
                }
                if (condition === "In-Store") {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }
    };
});
