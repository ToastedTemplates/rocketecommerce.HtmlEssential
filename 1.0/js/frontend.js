var cartId = "rocketcart_demolist";

var localAdapter = {

    saveCart: function (object) {

        var stringified = JSON.stringify(object);
        localStorage.setItem(cartId, stringified);
        return true;

    },
    getCart: function () {

        return JSON.parse(localStorage.getItem(cartId));

    },
    clearCart: function () {

        localStorage.removeItem(cartId);

    }

};

var ajaxAdapter = {

    saveCart: function (object) {

        var stringified = JSON.stringify(object);
        // do an ajax request here

    },
    getCart: function () {

        // do an ajax request -- recognize user by cookie / ip / session
        return JSON.parse(data);

    },
    clearCart: function () {

        //do an ajax request here

    }

};

var storage = localAdapter;

var cart = {

    count: 0,
    total: 0,
    items: [],
    getItems: function () {

        return this.items;

    },
    setItems: function (items) {

        this.items = items;
        for (var i = 0; i < this.items.length; i++) {
            var _item = this.items[i];
            this.count += _item.qty;
        }
    },
    clearItems: function () {

        this.items = [];
        this.total = 0;
        storage.clearCart();
        helpers.emptyView();

    },
    addItem: function (item) {
        if (this.containsItem(item.key) === false) {
            this.items.push({
                key: item.key,
                productid: item.productid,
                modelid: item.modelid,
                optionlist: item.optionlist,
                optionlistvalue: item.optionlistvalue,
                qty: item.qty
            });
            storage.saveCart(this.items);
        } else {
            if (item.qty > 0) {
                this.updateItem(item);
            } else {
                this.removeItem(item);
            }

        }
        this.count += item.count;
    },
    containsItem: function (key) {

        if (this.items === undefined) {
            return false;
        }

        for (var i = 0; i < this.items.length; i++) {

            var _item = this.items[i];

            if (key === _item.key) {
                return true;
            }

        }
        return false;

    },
    updateItem: function (object) {

        for (var i = 0; i < this.items.length; i++) {

            var _item = this.items[i];
            if (object.key === _item.key) {
                _item.qty = parseInt(object.qty);
                this.items[i] = _item;
                storage.saveCart(this.items);
            }

        }

    },
    removeItem: function (object) {
        for (var i = 0; i < this.items.length; i++) {
            var _item = this.items[i];
            if (object.key === _item.key) {
                this.items.splice(i, 1);
                storage.saveCart(this.items);
            }

        }

    }
};



// CART FUNCTIONS

function addToCart(productid) {
    var cartitem = buildCartItem(productid);
    cart.addItem(cartitem);
}

function buildCartItem(productid) {
    var qty = parseInt($('#qty' + productid).html());
    var modelid = $('#modelid' + productid).val();
    var optionlist = '';
    var optionlistvalue = '';
    $('.option' + productid).each(function (i, obj) {
        optionlist = optionlist + $(obj).attr('optionkey') + ' ';
        controlVal = $(obj).val();
        if (controlVal === '') {
            controlVal = $('input[name="optionid' + i + 'radio"]:checked').val();
            alert(controlVal);
        }
        optionlistvalue = optionlistvalue + simplisity_encode(controlVal) + ' ';
    });
    optionlist = optionlist.substring(0, optionlist.length - 1);
    optionlistvalue = optionlistvalue.substring(0, optionlistvalue.length - 1);

    key = productid + '.' + modelid;
    var item = {
        key: key,
        productid: productid,
        modelid: modelid,
        optionlist: optionlist,
        optionlistvalue: optionlistvalue,
        qty: qty,
    };
    return item;
}


function setProductQtyDisplay() {
    $('.qtyvalue').html('0');// reset all qty
    $('.optionsection').addClass("w3-display-hover");

    // reload qty value (for model selected only)
    var items = cart.getItems();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var modelid = $('#modelid' + item.productid).val();
        var key = item.productid + '.' + modelid;

        if (item.key === key) {
            $('#qty' + item.productid).html(item.qty);
            if (item.qty > 0) {
                $('#optionsection' + item.productid).removeClass("w3-display-hover");
            }
        }
    }
}


$(document).ready(function () {

    if (storage.getCart()) {
        // [TODO]: verify the scart products serverside
        cart.setItems(storage.getCart());

    } 
});

