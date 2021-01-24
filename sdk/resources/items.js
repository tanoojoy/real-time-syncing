'use strict';

var ArctickClient = require('../apiClient');
var util = require('util');

function Items() {
    ArctickClient.apply(this, arguments);
}

util.inherits(Items, ArctickClient);

Items.prototype.getItems = function(options, callback) {
    const pageSize = options.pageSize;
    const pageNumber = options.pageNumber;
    const tags = options.tags;
    const withChildItems = options.withChildItems;
    const sort = options.sort;
    const sellerId = options.sellerId;
    const variantGroupId = options.variantGroupId;
    const variantId = options.variantId;

    this._makeRequest({
        method: 'GET',
        path: '/api/v2/items',
        params: {
            tags: tags,
            pageSize: pageSize,
            pageNumber: pageNumber,
            withChildItems: withChildItems,
            sort: sort,
            sellerId: sellerId,
            variantGroupId: variantGroupId,
            variantId: variantId
        }
    }, callback);
};

Items.prototype.getMerchantItems = function(options, callback) {
    const sellerId = options.sellerId;
    const pageSize = options.pageSize;
    const pageNumber = options.pageNumber;
    const tags = options.tags;
    const withChildItems = options.withChildItems;
    const sort = options.sort;
    const keyword = options.keyword;
    const filterAvailable = options.filterAvailable;
    const filterVisible = options.filterVisible;
    const variantGroupId = options.variantGroupId;
    const variantId = options.variantId;

    if (typeof sellerId === 'undefined' || sellerId == '') callback(null);
    this._makeRequest({
        method: 'GET',
        path: '/api/v2/items',
        params: {
            sellerId: sellerId,
            pageSize: pageSize,
            pageNumber: pageNumber,
            tags: tags,
            withChildItems: withChildItems,
            sort: sort,
            keywords: keyword,
            filterAvailable: filterAvailable,
            filterVisible: filterVisible,
            variantGroupId: variantGroupId,
            variantId: variantId
        }
    }, callback);
};

Items.prototype.getItemDetails = function (options, callback) {
    this._makeRequest({
        method: 'GET',
        path: '/api/v2/items/' + options.itemId,
        params: {
            activeOnly: options.activeOnly,
            ControlFlags: options.ControlFlags
        }
    }, callback);
};

Items.prototype.createItem = function(options, callback) {
    const self = this;
    this._enforce(options, ['merchantId']);
    this._acquireAdminAccessToken(function() {
        self._makeRequest({
            method: 'POST',
            contentType: 'application/json',
            accept: 'application/json',
            path: '/api/v2/merchants/' + options.merchantId + '/items',
            data: options.data
        }, callback);
    });
};

Items.prototype.filterItem = function(options, callback) {
    const self = this;
    this._acquireAdminAccessToken(function() {
        self._makeRequest({
            method: 'POST',
            contentType: 'application/json',
            accept: 'application/json',
            path: '/api/v2/items',
            data: options
        }, callback);
    });
};

Items.prototype.EditNewItem = function (options, callback) {
    const self = this;
    this._enforce(options, ['merchantId']);
    const itemId = options.itemId;

    this._acquireAdminAccessToken(function () {
        self._makeRequest({
            method: 'PUT',
            contentType: 'application/json',
            accept: 'application/json',
            path: '/api/v2/merchants/' + options.merchantId + '/items/' + itemId,
            data: options.data
        }, callback);
    });
};

Items.prototype.searchItems = function (options, callback) {
    this._makeRequest({
        method: 'GET',
        path: '/api/v2/items',
        params: {
            pageSize: options.pageSize,
            pageNumber: options.pageNumber,
            tags: options.tags,
            withChildItems: options.withChildItems,
            sort: options.sort,
            keywords: options.keywords,
            minPrice: options.minimumPrice,
            maxPrice: options.maximumPrice,
            categories: options.categories,
            customFields: options.customfields,
            customValues: options.customValues,
            sellerId: options.sellerId,
            variantGroupId: options.variantGroupId,
            variantId: options.variantId
        }
    }, callback);
};

Items.prototype.editItem = function(options, callback) {
    const self = this;

    const merchantId = options.merchantId;
    const itemId = options.itemId;
    const isAvailable = options.isAvailable;

    self._acquireAdminAccessToken(function() {
        self._makeRequest({
            method: 'PUT',
            path: '/api/v2/merchants/' + merchantId + '/items/' + itemId,
            data: {
                IsAvailable: isAvailable
            }
        }, callback);
    });
};

Items.prototype.deleteItem = function(options, callback) {
    const self = this;

    const merchantId = options.merchantId;
    const itemId = options.itemId;

    self._acquireAdminAccessToken(function() {
        self._makeRequest({
            method: 'DELETE',
            path: '/api/v2/merchants/' + merchantId + '/items/' + itemId
        }, callback);
    });
};

Items.prototype.getItemFeedback = function(options, callback) {
    const self = this;
    const { itemId } = options;
    self._acquireAdminAccessToken(function() {
        self._makeRequest({
            method: 'GET',
            path: `/api/v2/items/${itemId}/feedback`
        }, callback);
    });
}

Items.prototype.getMerchantFeedback = function (options, callback) {
    const self = this;
    const { merchantId } = options;
    const { keyword } = options;

    self._acquireAdminAccessToken(function () {
        self._makeRequest({
            method: 'GET',
            path: `/api/v2/feedback/${merchantId}`,
            params: {
                keyword: keyword,
                pageNo: options.pageNo,
                pageSize: options.pageSize
            }
        }, callback);
    });
}

Items.prototype.getTags = function (options, callback) {
    const self = this;
    self._acquireAdminAccessToken(function () {
        self._makeRequest({
            method: 'GET',
            path: `/api/v2/items/tags`,
            params: {
                pageNumber: options.pageNumber,
                pageSize: options.pageSize
            }
        }, callback);
    });
}

Items.prototype.addReplyFeedback = function (options, callback) {
    const self = this;
    const { merchantId, feedbackId, message } = options;
    self._acquireAdminAccessToken(function () {
        self._makeRequest({
            method: 'POST',
            path: `/api/v2/merchants/${merchantId}/feedbacks/${feedbackId}`,
            data: {
                message
            }
        }, callback);
    });
}

Items.prototype.getAdminVariantsByGroupId = function (options, callback) {
    const self = this;
    const variantGroupId = options.variantGroupId;

    this._acquireAdminAccessToken(function (err, admin) {
        self._makeRequest({
            method: 'GET',
            path: `/api/v2/admins/${admin.UserId}/variant-groups/${variantGroupId}/variants`,
            params: {}
        }, callback);
    });
};

module.exports = Items;