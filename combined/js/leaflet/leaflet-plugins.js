L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topleft',
        title: {
            'false': 'View Fullscreen',
            'true': 'Exit Fullscreen'
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
        this.link.href = '#';

        this._map = map;
        this._map.on('fullscreenchange', this._toggleTitle, this);
        this._toggleTitle();

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this._map.toggleFullscreen(this.options);
    },

    _toggleTitle: function() {
        this.link.title = this.options.title[this._map.isFullscreen()];
    }
});

L.Map.include({
    isFullscreen: function () {
        return this._isFullscreen || false;
    },

    toggleFullscreen: function (options) {
        var container = this.getContainer();
        if (this.isFullscreen()) {
            if (options && options.pseudoFullscreen) {
                this._disablePseudoFullscreen(container);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this._disablePseudoFullscreen(container);
            }
        } else {
            if (options && options.pseudoFullscreen) {
                this._enablePseudoFullscreen(container);
            } else if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            } else {
                this._enablePseudoFullscreen(container);
            }
        }

    },

    _enablePseudoFullscreen: function (container) {
        L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(true);
        this.fire('fullscreenchange');
    },

    _disablePseudoFullscreen: function (container) {
        L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(false);
        this.fire('fullscreenchange');
    },

    _setFullscreen: function(fullscreen) {
        this._isFullscreen = fullscreen;
        var container = this.getContainer();
        if (fullscreen) {
            L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
        } else {
            L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
        }
        this.invalidateSize();
    },

    _onFullscreenChange: function (e) {
        var fullscreenElement =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;

        if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
            this._setFullscreen(true);
            this.fire('fullscreenchange');
        } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
            this._setFullscreen(false);
            this.fire('fullscreenchange');
        }
    }
});

L.Map.mergeOptions({
    fullscreenControl: false
});

L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
        this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
        this.addControl(this.fullscreenControl);
    }

    var fullscreenchange;

    if ('onfullscreenchange' in document) {
        fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
        fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
        fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
        fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
        var onFullscreenChange = L.bind(this._onFullscreenChange, this);

        this.whenReady(function () {
            L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
        });

        this.on('unload', function () {
            L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
        });
    }
});

L.control.fullscreen = function (options) {
    return new L.Control.Fullscreen(options);
};


!function(t,i){"function"==typeof define&&define.amd?define(["leaflet"],t):"object"==typeof exports&&(void 0!==i&&i.L?module.exports=t(L):module.exports=t(require("leaflet"))),void 0!==i&&i.L&&(i.L.Control.Locate=t(L))}(function(r){function o(i,o,t){(t=t.split(" ")).forEach(function(t){r.DomUtil[i].call(this,o,t)})}function i(t,i){o("addClass",t,i)}function s(t,i){o("removeClass",t,i)}var t=r.Marker.extend({initialize:function(t,i){r.Util.setOptions(this,i),this._latlng=t,this.createIcon()},createIcon:function(){var t=this.options,i="";void 0!==t.color&&(i+="stroke:"+t.color+";"),void 0!==t.weight&&(i+="stroke-width:"+t.weight+";"),void 0!==t.fillColor&&(i+="fill:"+t.fillColor+";"),void 0!==t.fillOpacity&&(i+="fill-opacity:"+t.fillOpacity+";"),void 0!==t.opacity&&(i+="opacity:"+t.opacity+";");var o=this._getIconSVG(t,i);this._locationIcon=r.divIcon({className:o.className,html:o.svg,iconSize:[o.w,o.h]}),this.setIcon(this._locationIcon)},_getIconSVG:function(t,i){var o=t.radius,s=o+t.weight,e=2*s;return{className:"leaflet-control-locate-location",svg:'<svg xmlns="http://www.w3.org/2000/svg" width="'+e+'" height="'+e+'" version="1.1" viewBox="-'+s+" -"+s+" "+e+" "+e+'"><circle r="'+o+'" style="'+i+'" /></svg>',w:e,h:e}},setStyle:function(t){r.Util.setOptions(this,t),this.createIcon()}}),e=t.extend({initialize:function(t,i,o){r.Util.setOptions(this,o),this._latlng=t,this._heading=i,this.createIcon()},setHeading:function(t){this._heading=t},_getIconSVG:function(t,i){var o=t.radius,s=t.width+t.weight,e=2*(o+t.depth+t.weight),n="M0,0 l"+t.width/2+","+t.depth+" l-"+s+",0 z";return{className:"leaflet-control-locate-heading",svg:'<svg xmlns="http://www.w3.org/2000/svg" width="'+s+'" height="'+e+'" version="1.1" viewBox="-'+s/2+" 0 "+s+" "+e+'" style="'+("transform: rotate("+this._heading+"deg)")+'"><path d="'+n+'" style="'+i+'" /></svg>',w:s,h:e}}}),n=r.Control.extend({options:{position:"topleft",layer:void 0,setView:"untilPanOrZoom",keepCurrentZoomLevel:!1,initialZoomLevel:!1,getLocationBounds:function(t){return t.bounds},flyTo:!1,clickBehavior:{inView:"stop",outOfView:"setView",inViewNotFollowing:"inView"},returnToPrevBounds:!1,cacheLocation:!0,drawCircle:!0,drawMarker:!0,showCompass:!0,markerClass:t,compassClass:e,circleStyle:{className:"leaflet-control-locate-circle",color:"#136AEC",fillColor:"#136AEC",fillOpacity:.15,weight:0},markerStyle:{className:"leaflet-control-locate-marker",color:"#fff",fillColor:"#2A93EE",fillOpacity:1,weight:3,opacity:1,radius:9},compassStyle:{fillColor:"#2A93EE",fillOpacity:1,weight:0,color:"#fff",opacity:1,radius:9,width:9,depth:6},followCircleStyle:{},followMarkerStyle:{},followCompassStyle:{},icon:"fa fa-map-marker",iconLoading:"fa fa-spinner fa-spin",iconElementTag:"span",circlePadding:[0,0],metric:!0,createButtonCallback:function(t,i){var o=r.DomUtil.create("a","leaflet-bar-part leaflet-bar-part-single",t);return o.title=i.strings.title,o.role="button",o.href="#",{link:o,icon:r.DomUtil.create(i.iconElementTag,i.icon,o)}},onLocationError:function(t,i){alert(t.message)},onLocationOutsideMapBounds:function(t){t.stop(),alert(t.options.strings.outsideMapBoundsMsg)},showPopup:!0,strings:{title:"Show me where I am",metersUnit:"meters",feetUnit:"feet",popup:"You are within {distance} {unit} from this point",outsideMapBoundsMsg:"You seem located outside the boundaries of the map"},locateOptions:{maxZoom:1/0,watch:!0,setView:!1}},initialize:function(t){for(var i in t)"object"==typeof this.options[i]?r.extend(this.options[i],t[i]):this.options[i]=t[i];this.options.followMarkerStyle=r.extend({},this.options.markerStyle,this.options.followMarkerStyle),this.options.followCircleStyle=r.extend({},this.options.circleStyle,this.options.followCircleStyle),this.options.followCompassStyle=r.extend({},this.options.compassStyle,this.options.followCompassStyle)},onAdd:function(t){var i=r.DomUtil.create("div","leaflet-control-locate leaflet-bar leaflet-control");this._container=i,this._map=t,this._layer=this.options.layer||new r.LayerGroup,this._layer.addTo(t),this._event=void 0,this._compassHeading=null,this._prevBounds=null;var o=this.options.createButtonCallback(i,this.options);return this._link=o.link,this._icon=o.icon,r.DomEvent.on(this._link,"click",function(t){r.DomEvent.stopPropagation(t),r.DomEvent.preventDefault(t),this._onClick()},this).on(this._link,"dblclick",r.DomEvent.stopPropagation),this._resetVariables(),this._map.on("unload",this._unload,this),i},_onClick:function(){this._justClicked=!0;var t=this._isFollowing();if(this._userPanned=!1,this._userZoomed=!1,this._active&&!this._event)this.stop();else if(this._active){var i=this.options.clickBehavior,o=i.outOfView;switch(this._map.getBounds().contains(this._event.latlng)&&(o=t?i.inView:i.inViewNotFollowing),i[o]&&(o=i[o]),o){case"setView":this.setView();break;case"stop":this.stop(),this.options.returnToPrevBounds&&(this.options.flyTo?this._map.flyToBounds:this._map.fitBounds).bind(this._map)(this._prevBounds)}}else this.options.returnToPrevBounds&&(this._prevBounds=this._map.getBounds()),this.start();this._updateContainerStyle()},start:function(){this._activate(),this._event&&(this._drawMarker(this._map),this.options.setView&&this.setView()),this._updateContainerStyle()},stop:function(){this._deactivate(),this._cleanClasses(),this._resetVariables(),this._removeMarker()},stopFollowing:function(){this._userPanned=!0,this._updateContainerStyle(),this._drawMarker()},_activate:function(){var t,i,o;this._active||(this._map.locate(this.options.locateOptions),this._map.fire("locateactivate",this),this._active=!0,this._map.on("locationfound",this._onLocationFound,this),this._map.on("locationerror",this._onLocationError,this),this._map.on("dragstart",this._onDrag,this),this._map.on("zoomstart",this._onZoom,this),this._map.on("zoomend",this._onZoomEnd,this),!this.options.showCompass||((t="ondeviceorientationabsolute"in window)||"ondeviceorientation"in window)&&(i=this,o=function(){r.DomEvent.on(window,t?"deviceorientationabsolute":"deviceorientation",i._onDeviceOrientation,i)},DeviceOrientationEvent&&"function"==typeof DeviceOrientationEvent.requestPermission?DeviceOrientationEvent.requestPermission().then(function(t){"granted"===t&&o()}):o()))},_deactivate:function(){this._map.stopLocate(),this._map.fire("locatedeactivate",this),this._active=!1,this.options.cacheLocation||(this._event=void 0),this._map.off("locationfound",this._onLocationFound,this),this._map.off("locationerror",this._onLocationError,this),this._map.off("dragstart",this._onDrag,this),this._map.off("zoomstart",this._onZoom,this),this._map.off("zoomend",this._onZoomEnd,this),this.options.showCompass&&(this._compassHeading=null,"ondeviceorientationabsolute"in window?r.DomEvent.off(window,"deviceorientationabsolute",this._onDeviceOrientation,this):"ondeviceorientation"in window&&r.DomEvent.off(window,"deviceorientation",this._onDeviceOrientation,this))},setView:function(){var t;this._drawMarker(),this._isOutsideMapBounds()?(this._event=void 0,this.options.onLocationOutsideMapBounds(this)):this._justClicked&&!1!==this.options.initialZoomLevel?(t=this.options.flyTo?this._map.flyTo:this._map.setView).bind(this._map)([this._event.latitude,this._event.longitude],this.options.initialZoomLevel):this.options.keepCurrentZoomLevel?(t=this.options.flyTo?this._map.flyTo:this._map.panTo).bind(this._map)([this._event.latitude,this._event.longitude]):(t=this.options.flyTo?this._map.flyToBounds:this._map.fitBounds,this._ignoreEvent=!0,t.bind(this._map)(this.options.getLocationBounds(this._event),{padding:this.options.circlePadding,maxZoom:this.options.locateOptions.maxZoom}),r.Util.requestAnimFrame(function(){this._ignoreEvent=!1},this))},_drawCompass:function(){var t,i;this._event&&(t=this._event.latlng,this.options.showCompass&&t&&null!==this._compassHeading&&(i=this._isFollowing()?this.options.followCompassStyle:this.options.compassStyle,this._compass?(this._compass.setLatLng(t),this._compass.setHeading(this._compassHeading),this._compass.setStyle&&this._compass.setStyle(i)):this._compass=new this.options.compassClass(t,this._compassHeading,i).addTo(this._layer)),!this._compass||this.options.showCompass&&null!==this._compassHeading||(this._compass.removeFrom(this._layer),this._compass=null))},_drawMarker:function(){void 0===this._event.accuracy&&(this._event.accuracy=0);var t,i,o,s,e=this._event.accuracy,n=this._event.latlng;this.options.drawCircle&&(t=this._isFollowing()?this.options.followCircleStyle:this.options.circleStyle,this._circle?this._circle.setLatLng(n).setRadius(e).setStyle(t):this._circle=r.circle(n,e,t).addTo(this._layer)),o=this.options.metric?(i=e.toFixed(0),this.options.strings.metersUnit):(i=(3.2808399*e).toFixed(0),this.options.strings.feetUnit),this.options.drawMarker&&(s=this._isFollowing()?this.options.followMarkerStyle:this.options.markerStyle,this._marker?(this._marker.setLatLng(n),this._marker.setStyle&&this._marker.setStyle(s)):this._marker=new this.options.markerClass(n,s).addTo(this._layer)),this._drawCompass();var a=this.options.strings.popup;function h(){return"string"==typeof a?r.Util.template(a,{distance:i,unit:o}):"function"==typeof a?a({distance:i,unit:o}):a}this.options.showPopup&&a&&this._marker&&this._marker.bindPopup(h())._popup.setLatLng(n),this.options.showPopup&&a&&this._compass&&this._compass.bindPopup(h())._popup.setLatLng(n)},_removeMarker:function(){this._layer.clearLayers(),this._marker=void 0,this._circle=void 0},_unload:function(){this.stop(),this._map.off("unload",this._unload,this)},_setCompassHeading:function(t){!isNaN(parseFloat(t))&&isFinite(t)?(t=Math.round(t),this._compassHeading=t,r.Util.requestAnimFrame(this._drawCompass,this)):this._compassHeading=null},_onCompassNeedsCalibration:function(){this._setCompassHeading()},_onDeviceOrientation:function(t){this._active&&(t.webkitCompassHeading?this._setCompassHeading(t.webkitCompassHeading):t.absolute&&t.alpha&&this._setCompassHeading(360-t.alpha))},_onLocationError:function(t){3==t.code&&this.options.locateOptions.watch||(this.stop(),this.options.onLocationError(t,this))},_onLocationFound:function(t){if((!this._event||this._event.latlng.lat!==t.latlng.lat||this._event.latlng.lng!==t.latlng.lng||this._event.accuracy!==t.accuracy)&&this._active){switch(this._event=t,this._drawMarker(),this._updateContainerStyle(),this.options.setView){case"once":this._justClicked&&this.setView();break;case"untilPan":this._userPanned||this.setView();break;case"untilPanOrZoom":this._userPanned||this._userZoomed||this.setView();break;case"always":this.setView()}this._justClicked=!1}},_onDrag:function(){this._event&&!this._ignoreEvent&&(this._userPanned=!0,this._updateContainerStyle(),this._drawMarker())},_onZoom:function(){this._event&&!this._ignoreEvent&&(this._userZoomed=!0,this._updateContainerStyle(),this._drawMarker())},_onZoomEnd:function(){this._event&&this._drawCompass(),this._event&&!this._ignoreEvent&&this._marker&&!this._map.getBounds().pad(-.3).contains(this._marker.getLatLng())&&(this._userPanned=!0,this._updateContainerStyle(),this._drawMarker())},_isFollowing:function(){return!!this._active&&("always"===this.options.setView||("untilPan"===this.options.setView?!this._userPanned:"untilPanOrZoom"===this.options.setView?!this._userPanned&&!this._userZoomed:void 0))},_isOutsideMapBounds:function(){return void 0!==this._event&&(this._map.options.maxBounds&&!this._map.options.maxBounds.contains(this._event.latlng))},_updateContainerStyle:function(){this._container&&(this._active&&!this._event?this._setClasses("requesting"):this._isFollowing()?this._setClasses("following"):this._active?this._setClasses("active"):this._cleanClasses())},_setClasses:function(t){"requesting"==t?(s(this._container,"active following"),i(this._container,"requesting"),s(this._icon,this.options.icon),i(this._icon,this.options.iconLoading)):"active"==t?(s(this._container,"requesting following"),i(this._container,"active"),s(this._icon,this.options.iconLoading),i(this._icon,this.options.icon)):"following"==t&&(s(this._container,"requesting"),i(this._container,"active following"),s(this._icon,this.options.iconLoading),i(this._icon,this.options.icon))},_cleanClasses:function(){r.DomUtil.removeClass(this._container,"requesting"),r.DomUtil.removeClass(this._container,"active"),r.DomUtil.removeClass(this._container,"following"),s(this._icon,this.options.iconLoading),i(this._icon,this.options.icon)},_resetVariables:function(){this._active=!1,this._justClicked=!1,this._userPanned=!1,this._userZoomed=!1}});return r.control.locate=function(t){return new r.Control.Locate(t)},n},window);
//# sourceMappingURL=L.Control.Locate.min.js.map

(function () {
    "use strict";

    L.Control.ZoomHome = L.Control.Zoom.extend({
        options: {
            position: 'topleft',
            zoomInText: '+',
            zoomInTitle: 'Zoom in',
            zoomOutText: '-',
            zoomOutTitle: 'Zoom out',
            zoomHomeIcon: 'home',
            zoomHomeTitle: 'Home',
            imageSource: null,
            homeCoordinates: null,
            homeZoom: null
        },

        onAdd: function (map) {
            var controlName = 'leaflet-control-zoomhome',
                container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                options = this.options;

            if (options.homeCoordinates === null) {
                options.homeCoordinates = map.getCenter();
            }
            if (options.homeZoom === null) {
                options.homeZoom = map.getZoom();
            }

            this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
                controlName + '-in', container, this._zoomIn.bind(this));
            var zoomHomeText = '<img class="zoomhome-img" alt="icon of a house" src=' + options.imageSource + '/>';
            this._zoomHomeButton = this._createButton(zoomHomeText, options.zoomHomeTitle,
                controlName + '-home', container, this._zoomHome.bind(this));
            this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
                controlName + '-out', container, this._zoomOut.bind(this));

            this._updateDisabled();
            map.on('zoomend zoomlevelschange', this._updateDisabled, this);

            return container;
        },

        setHomeBounds: function (bounds) {
            if (bounds === undefined) {
                bounds = this._map.getBounds();
            } else {
                if (typeof bounds.getCenter !== 'function') {
                    bounds = L.latLngBounds(bounds);
                }
            }
            this.options.homeZoom = this._map.getBoundsZoom(bounds);
            this.options.homeCoordinates = bounds.getCenter();
        },

        setHomeCoordinates: function (coordinates) {
            if (coordinates === undefined) {
                coordinates = this._map.getCenter();
            }
            this.options.homeCoordinates = coordinates;
        },

        setHomeZoom: function (zoom) {
            if (zoom === undefined) {
                zoom = this._map.getZoom();
            }
            this.options.homeZoom = zoom;
        },

        getHomeZoom: function () {
            return this.options.homeZoom;
        },

        getHomeCoordinates: function () {
            return this.options.homeCoordinates;
        },

        _zoomHome: function (e) {
            //jshint unused:false
            this._map.setView(this.options.homeCoordinates, this.options.homeZoom);
        }
    });

    L.Control.zoomHome = function (options) {
        return new L.Control.ZoomHome(options);
    };
}());
