'use strict';

var Arctick = require('./apiClient');
var client = new Arctick({
    apiBaseUrl: 'tanoo.sandbox.arcadier.io',
    protocol: 'https',
    clientId: 'l8nmu6B55H8LoMicsebOpxpo8InCiivJNnqgpoa7',
    clientSecret: 'NjF79jv9vx_uSlpgwSoEiP0e5O90I6kAH3P1PmWWPHEjnQo6KH9'
});
var resources = {
    Accounts: require('./resources/accounts'),
    Items: require('./resources/items'),
    Categories: require('./resources/categories'),
    Users: require('./resources/users'),
    Panels: require('./resources/panels'),
    Purchases: require('./resources/purchases'),
    Addresses: require('./resources/addresses'),
    Orders: require('./resources/orders'),
    Inbox: require('./resources/inbox'),
    CustomFields: require('./resources/customfields'),
    ShippingMethods: require('./resources/shippingMethods'),
    Transactions: require('./resources/transactions'),
    Files: require('./resources/files'),
    Comparisons: require('./resources/comparisons'),
    Carts: require('./resources/carts'),
    Marketplaces: require('./resources/marketplaces'),
    ActivityLog: require('./resources/activitylog'),
    Emails: require('./resources/emails'),
    Payments: require('./resources/payments'),
    Media: require('./resources/media'),
    ContentPages: require('./resources/contentPages'),
    Chat: require('./resources/chat'),
    CustomTables: require('./resources/customTables'),
    Quotations: require('./resources/quotations'),
    Requisitions: require('./resources/requisitions'),
    ReceivingNotes: require('./resources/receivingNotes'),
    Invoices: require('./resources/invoices'),

    SSO: require('./resources/sso')
};
client._prepResources(resources);

module.exports = client;
