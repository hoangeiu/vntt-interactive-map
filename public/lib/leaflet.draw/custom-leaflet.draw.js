L.Draw.Pop = L.Draw.Feature.extend({
  statics: {
    TYPE: "pop",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.Pop.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.Cabinet = L.Draw.Feature.extend({
  statics: {
    TYPE: "cabinet",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.Cabinet.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.CabinetLv1 = L.Draw.Feature.extend({
  statics: {
    TYPE: "cabinetlv1",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.CabinetLv1.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.CabinetLv2 = L.Draw.Feature.extend({
  statics: {
    TYPE: "cabinetlv2",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.CabinetLv2.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.MX = L.Draw.Feature.extend({
  statics: {
    TYPE: "mx",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.MX.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.Ont = L.Draw.Feature.extend({
  statics: {
    TYPE: "ont",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.Ont.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.UtilityPole = L.Draw.Feature.extend({
  statics: {
    TYPE: "utilitypole",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.UtilityPole.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});

L.Draw.Sewer = L.Draw.Feature.extend({
  statics: {
    TYPE: "sewer",
  },
  options: {
    icon: new L.Icon.Default(),
    repeatMode: !1,
    zIndexOffset: 2e3,
  },
  initialize: function (t, e) {
    (this.type = L.Draw.Sewer.TYPE),
      (this._initialLabelText = L.drawLocal.draw.handlers.marker.tooltip.start),
      L.Draw.Feature.prototype.initialize.call(this, t, e);
  },
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this),
      this._map &&
        (this._tooltip.updateContent({
          text: this._initialLabelText,
        }),
        this._mouseMarker ||
          (this._mouseMarker = L.marker(this._map.getCenter(), {
            icon: L.divIcon({
              className: "leaflet-mouse-marker",
              iconAnchor: [20, 20],
              iconSize: [40, 40],
            }),
            opacity: 0,
            zIndexOffset: this.options.zIndexOffset,
          })),
        this._mouseMarker.on("click", this._onClick, this).addTo(this._map),
        this._map.on("mousemove", this._onMouseMove, this),
        this._map.on("click", this._onTouch, this));
  },
  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this),
      this._map &&
        (this._map
          .off("click", this._onClick, this)
          .off("click", this._onTouch, this),
        this._marker &&
          (this._marker.off("click", this._onClick, this),
          this._map.removeLayer(this._marker),
          delete this._marker),
        this._mouseMarker.off("click", this._onClick, this),
        this._map.removeLayer(this._mouseMarker),
        delete this._mouseMarker,
        this._map.off("mousemove", this._onMouseMove, this));
  },
  _onMouseMove: function (t) {
    var e = t.latlng;
    this._tooltip.updatePosition(e),
      this._mouseMarker.setLatLng(e),
      this._marker
        ? ((e = this._mouseMarker.getLatLng()), this._marker.setLatLng(e))
        : ((this._marker = this._createMarker(e)),
          this._marker.on("click", this._onClick, this),
          this._map.on("click", this._onClick, this).addLayer(this._marker));
  },
  _createMarker: function (t) {
    return new L.Marker(t, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset,
    });
  },
  _onClick: function () {
    this._fireCreatedEvent(),
      this.disable(),
      this.options.repeatMode && this.enable();
  },
  _onTouch: function (t) {
    this._onMouseMove(t), this._onClick();
  },
  _fireCreatedEvent: function () {
    var t = new L.Marker.Touch(this._marker.getLatLng(), {
      icon: this.options.icon,
    });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, t);
  },
});
