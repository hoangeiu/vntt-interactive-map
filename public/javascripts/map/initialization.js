//#region
var streets = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Tile sử dụng api của <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    minZoom: 1,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiaG9hbmcwNTExOTUiLCJhIjoiY2s3anU1NnA1MDd3NTNtbG0wZTFzYXg2ciJ9.O5rWoi7udCXWXEMm8fxLMg",
  }
);

var satellite = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Tile sử dụng api của <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    minZoom: 5,
    id: "mapbox/satellite-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiaG9hbmcwNTExOTUiLCJhIjoiY2s3anU1NnA1MDd3NTNtbG0wZTFzYXg2ciJ9.O5rWoi7udCXWXEMm8fxLMg",
  }
);

// var OpenStreetMap = L.tileLayer(
//   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//   {
//     maxZoom: 19,
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }
// );
//#endregion

const sidebarHeight = $("#accordionSidebar").height();
$("#mapid").css("height", `${sidebarHeight}px`);

var center = JSON.parse(localStorage.getItem("center"));

var map = L.map("mapid", {
  center: [center.lat, center.lng],
  zoom: 15,
  layers: [streets],
});

L.control.ruler().addTo(map);

var popLayer = L.layerGroup().addTo(map);
var cbLayer = L.layerGroup().addTo(map);
var cfLayer = L.layerGroup().addTo(map);
var csLayer = L.layerGroup().addTo(map);
var mxLayer = L.layerGroup().addTo(map);
var cableLayer = L.layerGroup().addTo(map);
var segmentLayer = L.layerGroup();
var ontLayer = L.layerGroup().addTo(map);
var upLayer = L.layerGroup().addTo(map);
var swLayer = L.layerGroup().addTo(map);

var markerCluster = new L.MarkerClusterGroup();
// map.addLayer(markerCluster);

var overlays = {
  "Trạm POP": popLayer,
  Cabinet: cbLayer,
  "Cabinet Lv1": cfLayer,
  "Cabinet Lv2": csLayer,
  "Măng xông": mxLayer,
  Cáp: cableLayer,
  ONT: markerCluster,
  "Trụ điện": upLayer,
  "Cống bể": swLayer,
  "Đánh số": segmentLayer,
};

var baseMaps = {
  "Bản đồ": streets,
  "Vệ tinh": satellite,
  // OpenStreetMap: OpenStreetMap,
};
L.control.layers(baseMaps, overlays).addTo(map);

// SEARCH
var searchLayer = L.layerGroup();
var searchControl = new L.Control.Search({
  layer: searchLayer,
  propertyName: "name",
  marker: false,
  moveToLocation: function (latlng, title, map) {
    map.setView(latlng, 20);
  },
});
searchControl.on("search:locationfound", function (e) {
  if (e.layer._popup) e.layer.openPopup();
});
map.addControl(searchControl);
// #SEARCH

var myFeatureGroup = new L.FeatureGroup();
map.addLayer(myFeatureGroup);

L.DrawToolbar.include({
  getModeHandlers: function (map) {
    return [
      {
        enabled: true,
        handler: new L.Draw.Pop(map, { icon: popIcon, repeatMode: false }),
        title: "Đặt POP",
      },
      {
        enabled: true,
        handler: new L.Draw.Cabinet(map, {
          icon: cabinetIcon,
          repeatMode: false,
        }),
        title: "Đăt cabinet",
      },
      {
        enabled: true,
        handler: new L.Draw.CabinetLv1(map, {
          icon: cabinetLv1Icon,
          repeatMode: false,
        }),
        title: "Đặt cabinet lv1",
      },
      {
        enabled: true,
        handler: new L.Draw.CabinetLv2(map, {
          icon: cabinetLv2Icon,
          repeatMode: false,
        }),
        title: "Đặt cabinet lv2",
      },
      {
        enabled: true,
        handler: new L.Draw.MX(map, { icon: mxOldIcon, repeatMode: false }),
        title: "Đặt măng xông",
      },
      // {
      //   enabled: true,
      //   handler: new L.Draw.Ont(map, {
      //     icon: ontIcon,
      //     repeatMode: false,
      //   }),
      //   title: "Đặt ONT",
      // },
      {
        enabled: true,
        handler: new L.Draw.UtilityPole(map, {
          icon: utilityPoleIcon,
          repeatMode: false,
        }),
        title: "Đặt trụ điện",
      },
      {
        enabled: true,
        handler: new L.Draw.Sewer(map, {
          icon: sewerIcon,
          repeatMode: false,
        }),
        title: "Đặt cống bể",
      },
    ];
  },
});
var options = {
  position: "topleft",
  edit: {
    featureGroup: myFeatureGroup,
    edit: false,
    remove: false,
  },
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

// Geoman
map.pm.addControls({
  position: "topleft",
  drawMarker: false,
  drawCircleMarker: false,
  drawRectangle: false,
  drawPolygon: false,
  drawCircle: false,
  cutPolygon: false,
  dragMode: false,
});

map.pm.setGlobalOptions({
  // preventMarkerRemoval: true,
  allowSelfIntersection: false,
});

map.pm.setPathOptions({
  color: "brown",
  weight: 5,
});

// KHỞI TẠO TOPBAR
//#region
topbarAreaAndPop();
async function topbarAreaAndPop() {
  const PROVINCES = await ajaxGET(APICollection.Areas);
  const POPS = await ajaxGET(APICollection.POP);
  $("#popTB").append("<option value='0'>Tất cả</option>");
  for (let i = 0; i < PROVINCES.length; i++) {
    const province = PROVINCES[i];
    POPS.filter((p) => p.idTbArea == province.id).map((p) => {
      var option = `<option value="${p.id}">${province.name}-${p.name}</option>`;
      $("#popTB").append(option);
    });
  }
}
//#endregion
