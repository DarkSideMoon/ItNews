'use strict';

function NewsUrl() {
    this.construct = function(builder) {
        builder.buildSource();
        builder.buildSortBy();
        builder.buildApiKey();

        return builder.get();
    }
}

module.exports = NewsUrl;