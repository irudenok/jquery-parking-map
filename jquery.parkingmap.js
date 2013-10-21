// Usage:
//     var map = new $.parkingMap($(".parking-map-widget-container"), { 
//         width: 400,
//         height: 300,
//         location {
//         }
//     });
;(function($) {
    $.parkingMap = function($el, options) {

        var defaults = {
            width: '600px',
            height: '400px',
            zoom: 15,
            location: {
                destination: "208 S. Jefferson St, Chicago, IL 60661"
                /* Alternatively you could provide 'lat' and 'lng' float values */
                /* { lat: 41.878598, lng: -87.638836 } */
            },
            showMarker:true,
            parkwhizKey: 'd4c5b1639a3e443de77c43bb4d4bc888'
        }

        var plugin = this;

        plugin.settings = {
            HDPI: (window.retina || window.devicePixelRatio > 1)
        };

        if (plugin.settings.HDPI) {
            $.extend(plugin.settings, {
                MAIN_SPRITE : 'https://dxqviapaoowtl.cloudfront.net/static/images/parkwhiz-sprite@2x.png',
                EXTENDED_SPRITE_101_300 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-101-300@2x.png',
                EXTENDED_SPRITE_301_500 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-301-500@2x.png',
                EXTENDED_SPRITE_501_700 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-501-700@2x.png',
                EXTENDED_SPRITE_701_900 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-701-900@2x.png',
                EXTENDED_SPRITE_901_999 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-901-999@2x.png'
            });
        } else {
            $.extend(plugin.settings, {
                MAIN_SPRITE : 'https://dxqviapaoowtl.cloudfront.net/static/images/parkwhiz-sprite.png',
                EXTENDED_SPRITE_101_300 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-101-300.png',
                EXTENDED_SPRITE_301_500 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-301-500.png',
                EXTENDED_SPRITE_501_700 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-501-700.png',
                EXTENDED_SPRITE_701_900 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-701-900.png',
                EXTENDED_SPRITE_901_999 : 'https://dxqviapaoowtl.cloudfront.net/static/images/map-price-sprite-extended-901-999.png'
            });
        }

        var init = function() {
            $.extend(plugin.settings, defaults, options);
            plugin.$el = $el;

            plugin._iconMeta = {
                size: new google.maps.Size(38,33),
                shadow: {
                    url: plugin.settings.MAIN_SPRITE,
                    size: new google.maps.Size(53,23),
                    origin: _spriteCoordinates('number_shadow'),
                    anchor: new google.maps.Point(20,23),
                    scaledSize: null
                }
            };
            if (plugin.settings.HDPI) {
                plugin._iconMeta.shadow.scaledSize = new google.maps.Size(477, 1098);
            }
        }

        plugin.createMap = function() {
            this.$el.width(this.settings.width);
            this.$el.height(this.settings.height);

            var mapOptions = {
                options:{
                    zoom: this.settings.zoom
                }
            };
            var markerOptions = {};
            if (this.settings.location.destination) {
                mapOptions.address = this.settings.location.destination;
                if (this.settings.showMarker) {
                    markerOptions.address = mapOptions.address;
                }
            } else if (this.settings.location.lat) {
                mapOptions.latLng = [
                    this.settings.location.lat,
                    this.settings.location.lng
                ];
                if (this.settings.showMarker) {
                    markerOptions.latLng = mapOptions.latLng;
                }
            }

            this.$el.gmap3({
                map: mapOptions,
                marker: markerOptions
            });

            this.getParking();
        };
        plugin.getParking = function() {
            this.listingsForTimePlace();
        };
        var _putListingsOnMap = function(listings) {
            var $el = plugin.$el;

            for (var i = 0; i < listings.length; i++) {
                var icon = _getIcons(listings[i].price);
                $el.gmap3({
                    marker: {
                        latLng: [ listings[i].lat, listings[i].lng ],
                        data: { listing: listings[i], icon: icon },
                        options : {
                            icon: icon.normal,
                            shadow: plugin._iconMeta.shadow
                        },
                        events : {
                            mouseover: function(marker, event, context) {
                                marker.setZIndex(999);
                                marker.setIcon(context.data.icon.active);
                            },
                            mouseout : function(marker, event, context) {
                                marker.setZIndex(998);
                                marker.setIcon(context.data.icon.normal);
                            }
                        }
                    }
                });
            }
        };

        /* 
         *
         * Options are any of those avaialble to the 'search' endpoint of the ParkWhiz API:
         *    https://www.parkwhiz.com/developers/search/
         */
        plugin.listingsForTimePlace = function(searchOptions) {
            if (typeof searchOptions == "undefined") {
                searchOptions = {};
            }

            searchOptions.key = this.settings.parkwhizKey;

            if (! searchOptions.start) {
                searchOptions.start = Math.round((new Date()).getTime() / 1000);
            }
            if (! searchOptions.end) {
                searchOptions.end = searchOptions.start + 10800; // 3 hrs
            }

            if (this.settings.location.destination) {
                searchOptions.destination = this.settings.location.destination;
            } else if (this.settings.location.lat) {
                searchOptions.lat = this.settings.location.lat;
                searchOptions.lng = this.settings.location.lng;
            }

            $.ajax('http://api.parkwhiz.com/search/', {
                dataType: 'jsonp',
                data: searchOptions,
                success: function(searchResults) {
                    _putListingsOnMap(searchResults.parking_listings);
                },
                error: function(xhr, err1, err2) {
                    alert(err1 + " " + err2);
                },
            });
        };

        var _spriteCoordinates = function(icon, color) {
            if (icon == 'p') {
                if (color == 'active') {
                    return new google.maps.Point(56, 693);
                } else {
                    return new google.maps.Point(0, 693);
                }
            } else if (icon == 'number_shadow') {
                return new google.maps.Point(396, 23);
            } else if (icon == 'p_shadow') {
                return new google.maps.Point(24, 693);
            } else {
                // money icon is 36x33, rows of 10, 100 blue (normal)

                var number = parseInt(icon) - 1;
                if (number >= 1000) {
                    number = 999;
                }

                var double_digits = number % 100;
                var hundreds = Math.floor(number/100);
                if (hundreds > 0) {
                    hundreds = (hundreds - 1) % 2;
                }

                var top = Math.floor(double_digits/10) * 34;
                if (color == 'active') {
                    top += 339;
                }

                var left = ((double_digits % 10) + (10*hundreds)) * 38;
                return new google.maps.Point(left, top);
            }
        };

        plugin._iconCache = {};
        var _getIcons = function(dollars) {

            if (! plugin._iconCache[dollars]) {

                var sprite, scaledSize;

                if (dollars <= 100) {
                    sprite = plugin.settings.MAIN_SPRITE;
                    scaledSize = new google.maps.Size(477, 1098);
                } else if (dollars > 100 && dollars <= 300 ) {
                    sprite = plugin.settings.EXTENDED_SPRITE_101_300;
                    scaledSize = new google.maps.Size(760, 680);
                } else if (dollars > 300 && dollars <= 500 ) {
                    sprite = plugin.settings.EXTENDED_SPRITE_301_500;
                    scaledSize = new google.maps.Size(760, 680);
                } else if (dollars > 500 && dollars <= 700 ) {
                    sprite = plugin.settings.EXTENDED_SPRITE_501_700;
                    scaledSize = new google.maps.Size(760, 680);
                } else if (dollars > 700 && dollars <= 900 ) {
                    sprite = plugin.settings.EXTENDED_SPRITE_701_900;
                    scaledSize = new google.maps.Size(760, 680);
                } else if (dollars > 900) {
                    sprite = plugin.settings.EXTENDED_SPRITE_901_999;
                    scaledSize = new google.maps.Size(380, 680);
                }

                plugin._iconCache[dollars] = {
                    'normal': {
                        url: sprite,
                        size: plugin._iconMeta.size,
                        scaledSize: scaledSize,
                        origin: (dollars == 0 ? new google.maps.Point(380,645) : _spriteCoordinates(dollars, 'normal') )
                    },
                    'active': {
                        url: sprite,
                        size: plugin._iconMeta.size,
                        scaledSize: scaledSize,
                        origin: (dollars == 0 ? new google.maps.Point(418,645) : _spriteCoordinates(dollars, 'active') )
                    }
                }
            }

            return plugin._iconCache[dollars];
        };

        init();

    }
})(jQuery);
