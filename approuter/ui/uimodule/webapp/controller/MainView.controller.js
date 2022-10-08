sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "com/sap/oflm/model/formatter",
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException"
], function(Controller, JSONModel, MessageBox, Fragment, formatter, SimpleType, ValidateException) {
    "use strict";

    return Controller.extend("com.sap.oflm.controller.MainView", {
        formatter: formatter,
        onInit: function() {
            this.getView().setModel(new JSONModel(), "ordersModel");
            this.getView().setModel(new JSONModel(), "productListModel");
            this.getView().setModel(new JSONModel(), "shipmentModel");
            this.getView().setModel(new JSONModel(), "countriesModel");
            this.getView().getModel("countriesModel").loadData("model/countries.json");
            this.getView().getModel("countriesModel").setSizeLimit(250);
            this.csrfToken = this.getCsrf();
            this.loadOrders();
        },
        /**
         * CSRF token
         */
        getCsrf: function() {
            var token = null;
            $.ajax({
                url: "/logisticsService/",
                type: "GET",
                async: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRF-Token", "Fetch");
                },
                complete: function(xhr) {
                    token = xhr.getResponseHeader("X-CSRF-Token");
                }
            });
            return token;
        },
        /**
         * Loads list of all the orders
         */
        loadOrders: function() {
            var that = this;
            this.ajaxCalls("/logisticsService/order", "Get").then(function(data) {
                that.getView().getModel("ordersModel").setData(data);
                that.getView().getModel("ordersModel").refresh(true);
            }).catch(function(error) {
                MessageBox.error("Error in loading Orders-" + error.statusText);
            });
        },
        createNewOrder: function() {
            var oView = this.getView();
            this.getView().setBusy(true);
            var that = this;
            if (!this.byId("orderDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.sap.oflm.view.orderView",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    that.getView().setBusy(false);
                    that._wizard = that.byId("createOrderWizard");
                    that._oNavContainer = that.byId("wizardNavContainer");
                    oDialog.open();
                    that.loadProductData();
                });
            } else {
                this.getView().setBusy(false);
                this.byId("orderDialog").open();
            }
        },
        loadProductData: function() {
            var that = this;
            this.ajaxCalls("/productService/getProducts", "Get").then(function(data) {
                that.getView().getModel("productListModel").setData(data);
            }).catch(function(error) {
                MessageBox.error("Error in loading Products-" + error.statusText);
            });
        },
        closeDialog: function() {
            this.byId("orderDialog").close();
        },
        productSelected: function(oEvent) {
            this._wizard.validateStep(this.byId("ProductTypeStep"));
            var bindingContext = oEvent.getParameters().selectedItem.getBindingContext("productListModel");
            var bindingPath = "productListModel>" + bindingContext.sPath + "/";
            this.byId("selectedProductObject").bindElement(bindingPath);
        },
        onRequestQuote: function() {
            var that = this;
            this.getView().setBusy(true);
            var object = this.getView().getModel("productListModel").getProperty(this.byId("selectedProductObject").getBindingContext("productListModel").sPath);
            var transportationMeans = this.byId("transportationMeans").getSelectedKey();
            var quantity = this.byId("quantityId").getValue();
            var distance = this.byId("distanceId").getValue();
            var disanceValidated, quantityValidated, transportationValidated;
            if (isNaN(parseInt(quantity))) {
                this.byId("quantityId").setValueState("Error");
                quantityValidated = false;
            } else {
                quantityValidated = true;
                this.byId("quantityId").setValueState("None");
            }
            if (isNaN(parseInt(distance))) {
                this.byId("distanceId").setValueState("Error");
                disanceValidated = false;
            } else {
                disanceValidated = true;
                this.byId("distanceId").setValueState("None");
            }
            if (transportationMeans.length < 1) {
                this.byId("transportationMeans").setValueState("Error");
                transportationValidated = false;
            } else {
                transportationValidated = true;
                this.byId("transportationMeans").setValueState("None");
            }
            var weight = parseInt(object.WEIGHT);

            if (disanceValidated && quantityValidated && transportationValidated) {
                var url = "/logisticsService/getQuote?mode=" + transportationMeans + "&productId=" + object.PRODUCTID + "&quantity=" +
                    quantity + "&totalDistanceMeasured=" + distance + "&weight=" + weight + "&dimension=" + object.DIMENSIONDEPTH + "," + object.DIMENSIONHEIGHT + "," + object.DIMENSIONWIDTH;
                this.ajaxCalls(url, "Get").then(function(data, res) {
                    if (res === "nocontent" || data == undefined) {
                        that.getView().setBusy(false);
                        MessageBox.error("Product Out of Stock. Please try with less quantity");
                    } else {
                        that.getView().setBusy(false);
                        that.byId("quoteBox").setVisible(true);
                        that.byId("quotePrice").setNumber(Math.ceil(data.Cost));
                        that._wizard.validateStep(that.byId("quoteStep"));
                    }
                }).catch(function(error) {
                    that.getView().setBusy(false);
                    MessageBox.error("Error in getting Quote-" + error.statusText);
                });
            }
        },
        onCreateOrder: function() {
            var countryText = this.byId("country")._getSelectedItemText();
            this.getView().getModel("shipmentModel").setProperty("/country", countryText);
            var nameValidated, phoneValidated, emailValidated;
            if (this.byId("name").getValue().length < 1) {
                nameValidated = false;
                this.byId("name").setValueState("Error");
            } else {
                nameValidated = true;
                this.byId("name").setValueState("None");
            }
            if (this.byId("mobile").getValue().length < 1) {
                phoneValidated = false;
                this.byId("mobile").setValueState("Error");
            } else {
                phoneValidated = true;
                this.byId("mobile").setValueState("None");
            }
            if (this.byId("email").getValue().length < 1) {
                emailValidated = false;
                this.byId("email").setValueState("Error");
            } else {
                emailValidated = true;
                this.byId("email").setValueState("None");
            }
            if (nameValidated && emailValidated && phoneValidated) {
                Fragment.load({
                    name: "com.sap.oflm.view.ReviewPage",
                    controller: this
                }).then(function(oWizardReviewPage) {
                    this.getView().addDependent(oWizardReviewPage);
                    this._oWizardReviewPage = oWizardReviewPage;
                    this._oNavContainer.addPage(this._oWizardReviewPage);
                    this._oNavContainer.to(this._oWizardReviewPage);
                    var path = this.getView().byId("productListSelection").getSelectedItem()
                        .getBindingContext("productListModel").getPath();
                    var bindingPath = "productListModel>" + path + "/";
                    oWizardReviewPage.getContent()[0].bindElement(bindingPath);
                    oWizardReviewPage.getContent()[1].getItems()[1].setText(this.byId("quantityId").getValue());
                }.bind(this));
            }
        },
        submitData: function() {
            var model = this.getView().getModel("shipmentModel").getData();
            var country = this.byId("country").getSelectedKey();
            var productData = this.getView().getModel("productListModel")
                .getProperty(this.getView().byId("productListSelection").getSelectedItem()
                    .getBindingContext("productListModel").getPath());
            var cost = this.getView().byId("quotePrice").getNumber();
            var transportationMeans = this.byId("transportationMeans").getSelectedKey();
            var quantity = this.byId("quantityId").getValue();
            var distance = this.byId("distanceId").getValue();
            var date = this.formatDate();
            var payload = {
                "contactPerson": model.person,
                "address": model.house + " " + model.street,
                "phone": model.phone,
                "countryCode": country,
                "email": model.email,
                "totalDistanceMeasured": parseInt(distance),
                "productName": productData.PRODUCTNAME,
                "productId": productData.PRODUCTID,
                "quantity": parseInt(quantity),
                "grossWeight": parseFloat(productData.WEIGHT),
                "transportationMeansType": transportationMeans,
                "lifecyclestatus": "A",
                "pickupdate": date,
                "deliverydate": date,
                "transportationCharges": parseInt(cost),
                "currencycode": "EUR"
            };
            this.createFreightOrder(payload, productData.PRODUCTID, quantity);
        },
        formatDate: function() {
            return new Date().toISOString().split("T")[0].replace(/-/g, "");
        },
        createFreightOrder: function(payload, productId, quantity) {
            var that = this;
            jQuery.ajax({
                url: "/logisticsService/order",
                method: "Post",
                headers: {
                    "x-csrf-token": this.csrfToken,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(payload),
                success: function(data) {
                    var updateStock = that.updateStock(productId, quantity);
                    updateStock.then(function(stock) {
                        if (stock) {
                            MessageBox.success("Order Created");
                            that.byId("orderDialog").destroy();
                            that.loadOrders();
                        }
                    }).catch(function(err) {
                        MessageBox.error("Error in Updating Stock-" + err.statusText);
                    });
                },
                error: function(err) {
                    MessageBox.error("Error in creating order-" + err.statusText);
                }
            });
        },
        updateStock: function(productId, quantity) {
            return new Promise(function(resolve, reject) {
                this.ajaxCalls("/productService/stock?productId=" + productId + "&quantity=" + quantity, "Put").then(function(data, res) {
                    resolve(data);
                }).catch(function(error) {
                    reject(error);
                });
            }.bind(this));
        },
        ajaxCalls: function(url, method) {
            var that = this;
            return new Promise(function(resolve, reject) {
                if (method === "Put") {
                    jQuery.ajax({
                        url: url,
                        headers: {
                            "x-csrf-token": that.csrfToken,
                            "Content-Type": "application/json"
                        },
                        method: method,
                        success: function(data, res) {
                            resolve(data, res);
                        },
                        error: function(err) {
                            reject(err);
                        }
                    });
                } else {
                    jQuery.ajax({
                        url: url,
                        method: method,
                        success: function(data, res) {
                            resolve(data, res);
                        },
                        error: function(err) {
                            reject(err);
                        }
                    });
                }
            });
        },
        customEMailType: SimpleType.extend("email", {
            formatValue: function(oValue) {
                return oValue;
            },
            parseValue: function(oValue) {
                //parsing step takes place before validating step, value could be altered here
                return oValue;
            },
            validateValue: function(oValue) {
                // The following Regex is NOT a completely correct one and only used for demonstration purposes.
                // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
                var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!oValue.match(rexMail)) {
                    throw new ValidateException("'" + oValue + "' is not a valid email address");
                }
            }
        })
    });
});