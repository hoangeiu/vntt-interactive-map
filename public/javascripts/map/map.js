if (!localStorage.getItem("popCol")) {
  localStorage.setItem("popCol", "[]");
  localStorage.setItem("cabinetCol", "[]");
  localStorage.setItem("cabinetLv1Col", "[]");
  localStorage.setItem("cabinetLv2Col", "[]");
  localStorage.setItem("mxCol", "[]");
  localStorage.setItem("ontCol", "[]");
  localStorage.setItem("cableCol", "[]");
  localStorage.setItem("utilitypoleCol", "[]");
  localStorage.setItem("sewerCol", "[]");

  localStorage.setItem("updatePopCol", "[]");
  localStorage.setItem("deletePopCol", "[]");

  localStorage.setItem("updateMxCol", "[]");
  localStorage.setItem("deleteMxCol", "[]");

  localStorage.setItem("updateCBCol", "[]");
  localStorage.setItem("deleteCBCol", "[]");

  localStorage.setItem("updateCFCol", "[]");
  localStorage.setItem("deleteCFCol", "[]");

  localStorage.setItem("updateCSCol", "[]");
  localStorage.setItem("deleteCSCol", "[]");

  localStorage.setItem("updateCableCol", "[]");
  localStorage.setItem("deleteCableCol", "[]");
}

var myStorage = [],
  markerStorage = [],
  popStorage = [],
  mxStorage = [],
  cableStorage = [],
  cbStorage = [],
  cb1Storage = [],
  cb2Storage = [],
  decorationStorage = [];

// LOAD DỮ LIỆU
//#region
ajaxGET(APICollection.Areas).then((res) => {
  for (let i = 0; i < res.length; i++) {
    const e = res[i];
    var option = `<option value="${e.id}">${e.name}</option>`;
    $("#popModal .province").append(option);
  }
});
var popDB, mxDB, cbDB, cableDB, ontDB;
var cableLC, popLC, mxLC, cbLC, cfLC, csLC, ontLC, upLC, swLC;
async function getAllData() {
  showLoading();
  popLayer.clearLayers();
  cbLayer.clearLayers();
  cfLayer.clearLayers();
  csLayer.clearLayers();
  mxLayer.clearLayers();
  cableLayer.clearLayers();
  ontLayer.clearLayers();
  upLayer.clearLayers();
  swLayer.clearLayers();

  popDB = await ajaxGET(APICollection.POP);
  mxDB = await ajaxGET(APICollection.MX);
  cbDB = await ajaxGET(APICollection.CB);
  cableDB = await ajaxGET(APICollection.Cable);
  cableLC = JSON.parse(localStorage.getItem("cableCol"));
  popLC = JSON.parse(localStorage.getItem("popCol"));
  mxLC = JSON.parse(localStorage.getItem("mxCol"));
  cbLC = JSON.parse(localStorage.getItem("cabinetCol"));
  cfLC = JSON.parse(localStorage.getItem("cabinetLv1Col"));
  csLC = JSON.parse(localStorage.getItem("cabinetLv2Col"));
  ontLC = JSON.parse(localStorage.getItem("ontCol"));
  upLC = JSON.parse(localStorage.getItem("utilitypoleCol"));
  swLC = JSON.parse(localStorage.getItem("sewerCol"));

  hideLoading();
}
async function getLocalData(id) {
  cableLC = JSON.parse(localStorage.getItem("cableCol"));
  popLC = JSON.parse(localStorage.getItem("popCol"));
  mxLC = JSON.parse(localStorage.getItem("mxCol"));
  cbLC = JSON.parse(localStorage.getItem("cabinetCol"));
  cfLC = JSON.parse(localStorage.getItem("cabinetLv1Col"));
  csLC = JSON.parse(localStorage.getItem("cabinetLv2Col"));
  ontLC = JSON.parse(localStorage.getItem("ontCol"));
  upLC = JSON.parse(localStorage.getItem("utilitypoleCol"));
  swLC = JSON.parse(localStorage.getItem("sewerCol"));
}
//#endregion
// #LOAD DỮ LIỆU

// HÀM VẼ CHÍNH
getAllData().then(() => {
  drawByMySelf(0);
  $(".pop").append('<option value="0"></option>');
  for (let i = 0; i < popDB.length; i++) {
    const e = popDB[i];
    var option = `<option value="${e.id}">${e.name}</option>`;
    $(".pop").append(option);
  }
});

function getCableType(type) {
  if (type == 1) {
    return "captruc";
  } else if (type == 2) {
    return "captuyen";
  } else if (type == 3) {
    return "lastmile";
  }
}

function drawDecoration(code, render, breakPoints) {
  for (let i = 0; i < render.length; i++) {
    if (render[i].attribute == 1) {
      var focus = [];
      focus.push(breakPoints[i]);
      focus.push(breakPoints[i + 1]);
      var tmp2 = L.polylineDecorator(focus, {
        patterns: [
          {
            offset: "5%",
            endOffset: "5%",
            repeat: 40,
            symbol: L.Symbol.dash({
              pixelSize: 7,
              pathOptions: { color: "#66fffa", weight: 12 },
            }),
          },
        ],
      });
      decorationStorage.push({ code: code, layer: tmp2 });
      cableLayer.addLayer(tmp2);
    }
  }
}

function drawCableSegmentNumbers(code, breakPoints) {
  for (let i = 0; i < breakPoints.length - 1; i++) {
    var segment = L.polyline([breakPoints[i], breakPoints[i + 1]]);

    segment.setText(`${i + 1}`, {
      offset: 20,
      center: true,
      attributes: {
        "font-weight": "bold",
        "font-size": "16px",
        style: "fill: skyblue; stroke: red",
      },
    });

    // segment.addTo(map);
    segmentLayer.addLayer(segment);
    decorationStorage.push({ code: code, layer: segment });
  }
}

function drawCableLC() {
  cableLC.map((x) => {
    var tmp = L.polyline(x.breakPoints, {
      id: x.id,
      type: "cable",
      code: x.code,
      name: x.name,
      className: getCableType(x.type),
    });

    drawDecoration(x.code, x.render, x.breakPoints);
    drawCableSegmentNumbers(x.code, x.breakPoints);

    cableLayer.addLayer(tmp);

    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }

    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin tuyến cáp</b></div>
        <div class='d-flex justify-content-center mt-1'>
          <button type="button" class="btn btn-info mr-1" onClick="showCableMD(
            '${x.id}', '${x.code}')">Edit</button>
        </div>
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr>
              <td>Code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Ký hiệu tuyến quang</td>
              <td>${x.name}</td>
            </tr>
            <tr>
              <td>Kết nối</td>
              <td>${x.connection}</td>
            </tr>
            <tr>
              <td>Dung lượng sợi</td>
              <td>${x.capacity}</td>
            </tr>
            <tr>
              <td>Chiều dài toàn tuyến</td>
              <td>${x["length"]}</td>
            </tr>
            <tr>
              <td>Mã cáp NXS</td>
              <td>${x.reference}</td>
            </tr>
            <tr>
              <td>Thời gian xây dựng</td>
              <td>${x.date}</td>
            </tr>
          </tbody>
      </table>
      </div>
      `,
      { className: "popupCable", minWidth: 270 }
    );
    tmp.setText(x.name, {
      offset: -10,
      center: true,
      attributes: { "font-weight": "bold", "font-size": "16px" },
    });
    // EVENT
    tmp.on("pm:update", (e) => {
      console.log(e);
      const { code } = e.target.options;
      const { _latlngs } = e.target;
      var breakPoints = [];
      for (let i = 0; i < _latlngs.length; i++) {
        var { lat, lng } = _latlngs[i];
        breakPoints.push([lat, lng]);
      }
      var render = [];
      for (let i = 0; i < _latlngs.length - 1; i++) {
        render.push({
          attribute: 1,
        });
      }
      var a = _latlngs[0];
      var b = _latlngs[_latlngs.length - 1];
      var c = markerStorage.find(
        (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(a)
      );
      var d = markerStorage.find(
        (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(b)
      );

      var data = JSON.parse(localStorage.getItem("cableCol"));
      var x = data.find((x) => x.code == code);
      if (_latlngs.length != x.breakPoints.length) {
        x.render = render;
      }
      x.breakPoints = breakPoints;
      x.start =
        c != undefined ? `${c.layer.options.type}-${c.layer.options.id}` : "";
      x.end =
        d != undefined ? `${d.layer.options.type}-${d.layer.options.id}` : "";
      localStorage.setItem("cableCol", JSON.stringify(data));

      var decorations = decorationStorage.filter((d) => d.code == code);
      decorations.map((o) => map.removeLayer(o.layer));
      drawDecoration(x.code, x.render, x.breakPoints);
      drawCableSegmentNumbers(x.code, x.breakPoints);
    });
    tmp.on("pm:vertexadded", (e) => {
      // // console.log(e);
      // const { code } = e.target.options;
      // const { _latlngs } = e.target;
      // var data = JSON.parse(localStorage.getItem("cableCol"));
      // var cable = data.find((x) => x.code == code);
      // // console.log(cable);
      // var index = null;
      // for (let i = 0; i < cable.breakPoints.length; i++) {
      //   const element = _latlngs[i];
      //   var point = [element.lat, element.lng];
      //   if (JSON.stringify(point) != JSON.stringify(cable.breakPoints[i])) {
      //     index = i;
      //     break;
      //   }
      // }
      // var tmp1 = cable.render.slice(0, index - 1);
      // var tmp2 = cable.render.slice(index, cable.render.length);
      // var newRender = [{ attribute: 2 }, { attribute: 2 }];
      // // console.log(index);
      // var tmp3 = tmp1.concat(newRender);
      // // console.log(tmp3);
      // var tmp4 = tmp3.concat(tmp2);
      // // console.log(tmp4);
      // cable.render = tmp4;
      // localStorage.setItem("cableCol", JSON.stringify(data));
      // // var decorations = decorationStorage.filter((d) => d.code == code);
      // // decorations.map((o) => map.removeLayer(o.layer));
      // // drawDecoration(code, tmp4, x.breakPoints);
      // // drawCableSegmentNumbers(code, x.breakPoints);
    });
    tmp.on("pm:vertexremoved", (e) => {
      console.log(e);
    });

    myStorage.push({ code: x.code, layer: tmp });
    cableStorage.push({ code: x.code, layer: tmp });
  });
}
function drawPoPLC() {
  popLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: popIcon,
      type: "pop",
      id: x.id,
      code: x.code,
      name: x.name,
    });
    popLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    // POP Popup
    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin của POP</b></div>
        <div class='d-flex justify-content-center mt-1'>
          <button type="button" class="btn btn-info mr-1" onClick="showPopModal(
            '${x.id}', '${x.code}')">Edit</button>
        </div>          
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr style="display: none;">
              <td>Code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Tên POP</td>
              <td>${x.name}</td>
            </tr>
            <tr>
              <td>Mô tả</td>
              <td>${x.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
      { className: "popupCable", minWidth: 270 }
    );
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("popCol"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("popCol", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
    // markerStorage.push({ code: x.code, layer: tmp });
    popStorage.push({ code: x.code, layer: tmp });
  });
}
function drawMXLC() {
  mxLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: x.status == 0 ? mxOldIcon : mxNewIcon,
      type: "mx",
      id: x.id,
      code: x.code,
      name: x.name,
    });
    mxLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    // MX Popup
    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin về măng xông</b></div>
        <div class='d-flex justify-content-center mt-1'>
          <button type="button" class="btn btn-info mr-1" onClick="showMxModal(
            '${x.id}', '${x.code}')">Edit</button>
        </div>          
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr style="display: none;">
              <td>Code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Ký hiệu măng xông</td>
              <td>${x.name}</td>
            </tr>
            <tr>
              <td>Chiều dài đoạn cáp</td>
              <td>${x["length"]}</td>
            </tr>
            <tr>
              <td>Ngày lắp đặt</td>
              <td>${x.date}</td>
            </tr>
          </tbody>
        </table>        
      </div>`,
      { className: "popupCable", minWidth: 300 }
    );
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("mxCol"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("mxCol", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
    // markerStorage.push({ code: x.code, layer: tmp });
    mxStorage.push({ code: x.code, layer: tmp });
  });
}
function drawCbLC() {
  cbLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: cabinetIcon,
      type: "cabinet",
      id: x.id,
      code: x.code,
      name: x.name,
    });
    cbLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    // CABINET Popup
    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin của Cabinet</b></div>
        <div class='d-flex justify-content-center mt-1'>
          <button type="button" class="btn btn-info mr-1" onClick="showCbMD(
            '${x.id}', '${x.code}')">Edit</button>
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr style="display: none;">
              <td>Code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Tên</td>
              <td>${x.name}</td>
            </tr>
            <tr>
              <td>Mô tả</td>
              <td>${x.description}</td>
            </tr>
          </tbody>
        </table>      
      </div>`,
      { className: "popupCable", minWidth: 270 }
    );
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("cabinetCol"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("cabinetCol", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
    // markerStorage.push({ code: x.code, layer: tmp });
    cbStorage.push({ code: x.code, layer: tmp });
  });
}
function drawCfLC() {
  cfLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: cabinetLv1Icon,
      type: "cabinet",
      id: x.id,
      code: x.code,
      name: x.name,
    });
    cfLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    // CABINET LEVEL 1 Popup
    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin của Cabinet Level 1</b></div>
        <div class='d-flex justify-content-center mt-1'>
        <button type="button" class="btn btn-info mr-1" onClick="showCb1MD(
          '${x.id}', '${x.code}')">Edit</button>
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr style="display: none;">
              <td>code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Tên</td>
              <td>${x.name}</td>
            </tr>            
            <tr>
              <td>Mô tả</td>
              <td>${x.description}</td>
            </tr>
          </tbody>
        </table>
      </div>`,
      { className: "popupCable", minWidth: 270 }
    );
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("cabinetLv1Col"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("cabinetLv1Col", JSON.stringify(data));
    });
    tmp.on("pm:dragend", (e) => {
      console.log(e);
    });

    myStorage.push({ code: x.code, layer: tmp });
    // markerStorage.push({ code: x.code, layer: tmp });
    cb1Storage.push({ code: x.code, layer: tmp });
  });
}
function drawCsLC() {
  csLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: cabinetLv2Icon,
      type: "cabinet",
      id: x.id,
      code: x.code,
      name: x.name,
    }).addTo(map);
    csLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    // CABINET LEVEL 2 Popup
    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin của Cabinet Level 2</b></div>
        <div class='d-flex justify-content-center mt-1'>
        <button type="button" class="btn btn-info float-right my-1" onClick="showCb2MD(
          '${x.id}', '${x.code}')">Edit</button>
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr style="display: none;">
              <td>Code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Tên</td>
              <td>${x.name}</td>
            </tr>
            <tr>
              <td>Mô tả</td>
              <td>${x.description}</td>
            </tr>
          </tbody>
        </table>
      </div>`,
      { className: "popupCable", minWidth: 270 }
    );
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("cabinetLv2Col"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("cabinetLv2Col", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
    // markerStorage.push({ code: x.code, layer: tmp });
    cb2Storage.push({ code: x.code, layer: tmp });
  });
}
function drawPoPDB(popId) {
  popDB.map((x) => {
    if (popId != 0 && x.id == popId) {
      children(x);
    }
    if (popId == 0) {
      children(x);
    }
  });
  function children(x) {
    if (x.pos != "") {
      var tmp = L.marker(JSON.parse(x.pos), {
        icon: popIcon,
        type: "pop",
        id: x.id,
        code: x.code,
        name: x.name,
      });
      popLayer.addLayer(tmp);
      if (x.name != "") {
        searchLayer.addLayer(tmp);
      }
      // POP Popup
      tmp.bindPopup(
        `<div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin của POP</b></div>
          <div class='d-flex justify-content-center mt-2'>
            <button type="button" class="btn btn-info mr-1" 
              onClick="popDetail('${x.id}')">Details</button>
            <button type="button" class="btn btn-info mr-1" onClick="showPopModal(
              '${x.id}', '${x.code}',)">Edit</button>            
          </div>          
        </div>
        <div>          
          <table class="table table-dark table-striped table-bordered">
            <tbody>
              <tr style="display: none;">
                <td>Code</td>
                <td>${x.code}</td>
              </tr>
              <tr>
                <td>Tên POP</td>
                <td>${x.name}</td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>${x.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
        { className: "popupCable", minWidth: 270 }
      );
      // EVENT
      tmp.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var index = popDB.findIndex((p) => p.code == code);
        popDB[index].pos = `[${lat}, ${lng}]`;

        var updatePopCol = JSON.parse(localStorage.getItem("updatePopCol"));
        var check = updatePopCol.findIndex((u) => u.code == popDB[index].code);
        if (check == -1) {
          updatePopCol.push(popDB[index]);
        } else {
          updatePopCol.splice(check, 1);
          updatePopCol.push(popDB[index]);
        }
        localStorage.setItem("updatePopCol", JSON.stringify(updatePopCol));
      });

      myStorage.push({ code: x.code, layer: tmp });
      markerStorage.push({ code: x.code, layer: tmp });
      popStorage.push({ code: x.code, layer: tmp });
    }
  }
}
function drawMXDB(popId) {
  mxDB.map((x) => {
    if (popId != 0 && x.idTbPop == popId) {
      children(x);
    }
    if (popId == 0) {
      children(x);
    }
  });
  function children(x) {
    if (x.pos != "") {
      var tmp = L.marker(JSON.parse(x.pos), {
        icon: x.status == 0 ? mxOldIcon : mxNewIcon,
        type: "mx",
        id: x.id,
        code: x.code,
        name: x.name,
      });
      mxLayer.addLayer(tmp);
      if (x.name != "") {
        searchLayer.addLayer(tmp);
      }
      // FORMAT DATE
      var formatDate = moment(x.date).format("DD/MM/YYYY");
      // MX Popup
      tmp.bindPopup(
        `
        <div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin về măng xông</b></div>
          <div class='d-flex justify-content-center mt-1'>
            <button type="button" class="btn btn-info mr-1" onClick="showMxModal(
              '${x.id}', '${x.code}')">Edit</button>
        </div>
        <div>
          <table class="table table-dark table-striped table-bordered">
            <tbody>
              <tr style="display: none;">
                <td>Code</td>
                <td>${x.code}</td>
              </tr>
              <tr>
                <td>Ký hiệu măng xông</td>
                <td>${x.name}</td>
              </tr>
              <tr>
                <td>Chiều dài đoạn cáp</td>
                <td>${x["length"]}</td>
              </tr>
              <tr>
                <td>Ngày lắp đặt</td>
                <td>${formatDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        `,
        { className: "popupCable", minWidth: 300 }
      );
      // EVENT
      tmp.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var index = mxDB.findIndex((p) => p.code == code);
        mxDB[index].pos = `[${lat}, ${lng}]`;

        var updateMxCol = JSON.parse(localStorage.getItem("updateMxCol"));
        var check = updateMxCol.findIndex((u) => u.code == mxDB[index].code);
        if (check == -1) {
          updateMxCol.push(mxDB[index]);
        } else {
          updateMxCol.splice(check, 1);
          updateMxCol.push(mxDB[index]);
        }
        localStorage.setItem("updateMxCol", JSON.stringify(updateMxCol));
      });

      myStorage.push({ code: x.code, layer: tmp });
      // markerStorage.push({ code: x.code, layer: tmp });
      mxStorage.push({ code: x.code, layer: tmp });
    }
  }
}
function drawCbDB(popId) {
  cbDB.map(async (x) => {
    if (popId != 0 && x.idTbPop == popId) {
      children(x);
    }
    if (popId == 0) {
      children(x);
    }
  });
  function children(x) {
    if (x.pos != "" && x.index == 0) {
      var tmp = L.marker(JSON.parse(x.pos), {
        icon: cabinetIcon,
        type: "cabinet",
        id: x.id,
        code: x.code,
        name: x.name,
      });
      cbLayer.addLayer(tmp);
      if (x.name != "") {
        searchLayer.addLayer(tmp);
      }
      // CABINET Popup
      tmp.bindPopup(
        `
        <div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin của Cabinet</b></div>
          <div class='d-flex justify-content-center mt-1'>
            <button type="button" class="btn btn-info mr-1" onClick="cabinetDetail('${x.id}')">Details</button>
            <button type="button" class="btn btn-info mr-1" onClick="showCbMD(
              '${x.id}', '${x.code}')">Edit</button>
        </div>
        <div>
          <table class="table table-dark table-striped table-bordered">
            <tbody>
              <tr style="display: none;">
                <td>Code</td>
                <td>${x.code}</td>
              </tr>
              <tr>
                <td>Tên Cabinet</td>
                <td>${x.name}</td>
              </tr>              
              <tr>
                <td>Mô tả</td>
                <td>${x.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
    `,
        { className: "popupCable", minWidth: 270 }
      );
      // EVENT
      tmp.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var index = cbDB.findIndex((p) => p.code == code);
        cbDB[index].pos = `[${lat}, ${lng}]`;

        var updateCBCol = JSON.parse(localStorage.getItem("updateCBCol"));
        var check = updateCBCol.findIndex((u) => u.code == cbDB[index].code);
        if (check == -1) {
          updateCBCol.push(cbDB[index]);
        } else {
          updateCBCol.splice(check, 1);
          updateCBCol.push(cbDB[index]);
        }
        localStorage.setItem("updateCBCol", JSON.stringify(updateCBCol));
      });

      myStorage.push({ code: x.code, layer: tmp });
      markerStorage.push({ code: x.code, layer: tmp });
      cbStorage.push({ code: x.code, layer: tmp });
    }
  }
}
function drawCfDB(popId) {
  cbDB.map(async (x) => {
    if (popId != 0 && x.idTbPop == popId) {
      children(x);
    }
    if (popId == 0) {
      children(x);
    }
  });
  function children(x) {
    if (x.pos != "" && x.index == 1) {
      var tmp = L.marker(JSON.parse(x.pos), {
        icon: cabinetLv1Icon,
        type: "cabinet",
        id: x.id,
        code: x.code,
        name: x.name,
      });
      cfLayer.addLayer(tmp);
      if (x.name != "") {
        searchLayer.addLayer(tmp);
      }

      // CABINET Popup
      tmp.bindPopup(
        `
        <div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin của Cabinet Level 1</b></div>
          <div class='d-flex justify-content-center mt-1'>
          <button type="button" class="btn btn-info mr-1" onClick="cabinetDetailLv1('${x.id}')">Details</button>
          <button type="button" class="btn btn-info mr-1" onClick="showCb1MD(
            '${x.id}', '${x.code}')">Edit</button>
        </div>
        <div>
          <table class="table table-dark table-striped table-bordered">
            <tbody>
              <tr style="display: none;">
                <td>Code</td>
                <td>${x.code}</td>
              </tr>
              <tr>
                <td>Tên Cabinet</td>
                <td>${x.name}</td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>${x.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
    `,
        { className: "popupCable", minWidth: 270 }
      );
      // EVENT
      tmp.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var index = cbDB.findIndex((p) => p.code == code);
        cbDB[index].pos = `[${lat}, ${lng}]`;

        var updateCFCol = JSON.parse(localStorage.getItem("updateCFCol"));
        var check = updateCFCol.findIndex((u) => u.code == cbDB[index].code);
        if (check == -1) {
          updateCFCol.push(cbDB[index]);
        } else {
          updateCFCol.splice(check, 1);
          updateCFCol.push(cbDB[index]);
        }
        localStorage.setItem("updateCFCol", JSON.stringify(updateCFCol));
      });

      myStorage.push({ code: x.code, layer: tmp });
      markerStorage.push({ code: x.code, layer: tmp });
      cb1Storage.push({ code: x.code, layer: tmp });
    }
  }
}
function drawCsDB(popId) {
  cbDB.map(async (x) => {
    if (popId != 0 && x.idTbPop == popId) {
      children(x);
    }
    if (popId == 0) {
      children(x);
    }
  });
  function children(x) {
    if (x.pos != "" && x.index == 2) {
      var tmp = L.marker(JSON.parse(x.pos), {
        icon: cabinetLv2Icon,
        type: "cabinet",
        id: x.id,
        code: x.code,
        name: x.name,
      });
      csLayer.addLayer(tmp);
      if (x.name != "") {
        searchLayer.addLayer(tmp);
      }
      // CABINET Popup
      tmp.bindPopup(
        `
        <div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin của Cabinet Level 2</b></div>
          <div class='d-flex justify-content-center mt-1'>
            <button type="button" class="btn btn-info mr-1" onClick="cabinetDetailLv2('${x.id}')">Details</button>
            <button type="button" class="btn btn-info mr-1" onClick="showCb2MD(
              '${x.id}', '${x.code}')">Edit</button>
        </div>
        <div>
          <table class="table table-dark table-striped table-bordered">
            <tbody>
              <tr style="display: none;">
                <td>Code</td>
                <td>${x.code}</td>
              </tr>
              <tr>
                <td>Tên Cabinet</td>
                <td>${x.name}</td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>${x.description}</td>
              </tr>
            </tbody>
          </table>
        </div>`,
        { className: "popupCable", minWidth: 270 }
      );
      // EVENT
      tmp.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var index = cbDB.findIndex((p) => p.code == code);
        cbDB[index].pos = `[${lat}, ${lng}]`;

        var updateCSCol = JSON.parse(localStorage.getItem("updateCSCol"));
        var check = updateCSCol.findIndex((u) => u.code == cbDB[index].code);
        if (check == -1) {
          updateCSCol.push(cbDB[index]);
        } else {
          updateCSCol.splice(check, 1);
          updateCSCol.push(cbDB[index]);
        }
        localStorage.setItem("updateCSCol", JSON.stringify(updateCSCol));
      });

      myStorage.push({ code: x.code, layer: tmp });
      markerStorage.push({ code: x.code, layer: tmp });
      cb2Storage.push({ code: x.code, layer: tmp });
    }
  }
}
function drawCableDB(popId) {
  cableDB.map((x) => {
    if (popId != 0 && x.id_tbPOP == popId) {
      children(x);
    }
    if (popId == 0) {
      children(x);
    }
  });
  function children(x) {
    if (x.posArray != "") {
      var tmp = L.polyline(JSON.parse(x.posArray), {
        id: x.id,
        type: "cable",
        code: x.code,
        name: x.name,
        className: getCableType(x.iD_tbCableType),
      });
      var render = JSON.parse(x.typeCableArray);

      drawDecoration(x.code, render, JSON.parse(x.posArray));

      drawCableSegmentNumbers(x.code, JSON.parse(x.posArray));

      cableLayer.addLayer(tmp);
      if (x.name != "") {
        searchLayer.addLayer(tmp);
      }
      var formatDate = moment(x.completeDate).format("DD/MM/YYYY");
      // CABLE Popup
      tmp.bindPopup(
        `
        <div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin tuyến cáp</b></div>
          <div class='d-flex justify-content-center mt-2'>    
            <button type="button" class="btn btn-info  mr-1" onClick="cableDetail('${x.id}', ${x.iD_tbCableType})">Core</button>          
            <button type="button" class="btn btn-info  mr-1" 
              onClick="showCableMD('${x.id}', '${x.code}')">Edit</button>            
          </div>          
        </div>
        <div>        
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr style="display: none;">
              <td>Code</td>
              <td>${x.code}</td>
            </tr>
            <tr>
              <td>Ký hiệu tuyến quang</td>
              <td>${x.name}</td>
            </tr>
            <tr>
              <td>Kết nối</td>
              <td>${x.connect}</td>
            </tr>
            <tr>
              <td>Dung lượng sợi</td>
              <td>${x.capacity}</td>
            </tr>
            <tr>
              <td>Chiều dài toàn tuyến</td>
              <td>${x["length"]}</td>
            </tr>
            <tr>
              <td>Mã cáp NXS</td>
              <td>${x.reference}</td>
            </tr>
            <tr>
              <td>Thời gian xây dựng</td>
              <td>${formatDate}</td>
            </tr>
          </tbody>
        </table>
        </div>
        `,
        { className: "popupCable", minWidth: 270 }
      );
      tmp.setText(x.name, {
        offset: -10,
        center: true,
        attributes: { "font-weight": "bold", "font-size": "16px" },
      });
      // EVENT
      tmp.on("pm:update", (e) => {
        var { code } = e.target.options;
        var _latlngs = e.target._latlngs;
        var breakPoints = [];
        for (let i = 0; i < _latlngs.length; i++) {
          var { lat, lng } = _latlngs[i];
          breakPoints.push([lat, lng]);
        }
        var posArray = [];
        for (let i = 0; i < breakPoints.length; i++) {
          const x = breakPoints[i];
          posArray.push(`[${x[0]}, ${x[1]}]`);
        }
        var typeCableArray = [];
        for (let i = 0; i < _latlngs.length - 1; i++) {
          typeCableArray.push({
            attribute: 1,
          });
        }
        var index = cableDB.findIndex((p) => p.code == code);
        cableDB[index].posBegin = `${posArray[0]}`;
        cableDB[index].posEnd = `${posArray[posArray.length - 1]}`;
        posArray = `[${posArray}]`;
        cableDB[index].posArray = posArray;
        cableDB[index].typeCableArray = JSON.stringify(typeCableArray);

        var a = _latlngs[0];
        var b = _latlngs[_latlngs.length - 1];
        var c = markerStorage.find(
          (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(a)
        );
        var d = markerStorage.find(
          (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(b)
        );
        cableDB[index].idObjectBegin = c != undefined ? c.layer.options.id : 0;
        cableDB[index].nameObjectBegin =
          c != undefined ? c.layer.options.type : "";
        cableDB[index].idObjectEnd = d != undefined ? d.layer.options.id : 0;
        cableDB[index].nameObjectEnd =
          d != undefined ? d.layer.options.type : "";

        var updateCableCol = JSON.parse(localStorage.getItem("updateCableCol"));
        var check = updateCableCol.findIndex(
          (u) => u.code == cableDB[index].code
        );
        if (check == -1) {
          updateCableCol.push(cableDB[index]);
        } else {
          updateCableCol.splice(check, 1);
          updateCableCol.push(cableDB[index]);
        }
        localStorage.setItem("updateCableCol", JSON.stringify(updateCableCol));

        var decorations = decorationStorage.filter((d) => d.code == code);
        decorations.map((o) => map.removeLayer(o.layer));
        drawDecoration(x.code, typeCableArray, breakPoints);
        drawCableSegmentNumbers(x.code, breakPoints);
      });

      myStorage.push({ code: x.code, layer: tmp });
      cableStorage.push({ code: x.code, layer: tmp });
    }
  }
}
function drawOntDB() {
  ontDB.map((x) => {
    var tmp = L.marker(JSON.parse(x.pos).reverse(), {
      icon: ontIcon,
      type: "ont",
      name: x.contractCode,
    });
    // ontLayer.addLayer(tmp);
    markerCluster.addLayer(tmp);
    if (x.contractCode != "") {
      searchLayer.addLayer(tmp);
    }
    tmp.bindPopup(
      `
      <div class='d-flex flex-column justify-content-center'>
          <div class='d-flex justify-content-center'><b>Thông tin của ONT</b></div>         
          </div>
          <div>          
            <table class="table table-dark table-striped table-bordered">
              <tbody>
                <tr>
                  <td>Code</td>
                  <td>${x.customerCode}</td>
                </tr>
                <tr>
                  <td>Tên</td>
                  <td>${x.customerName}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>${x.phone}</td>
                </tr>
                <tr>
                  <td>Mã HĐ</td>
                  <td>${x.contractCode}</td>
                </tr>
              </tbody>
            </table>
          </div>
      `,
      { className: "popupCable", minWidth: 270 }
    );
    // // EVENT
    // tmp.on("pm:update", (e) => {
    //   var { code } = e.target.options;
    //   var { lat, lng } = e.target._latlng;

    //   var data = JSON.parse(localStorage.getItem("ontCol"));
    //   var x = data.find((x) => x.code == code);
    //   x.location = [lat, lng];
    //   localStorage.setItem("ontCol", JSON.stringify(data));
    // });

    // myStorage.push({ code: x.code, layer: tmp });
  });
}
// DRAW BY MYSELF
function drawByMySelf(popId) {
  myStorage = [];
  showLoading();
  drawCableLC();
  drawPoPLC();
  drawMXLC();
  drawCbLC();
  drawCfLC();
  drawCsLC();
  drawPoPDB(popId);
  drawMXDB(popId);
  drawCbDB(popId);
  drawCfDB(popId);
  drawCsDB(popId);
  drawCableDB(popId);
  ontLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: ontIcon,
      type: "ont",
      code: x.code,
      name: x.name,
    });
    ontLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    tmp.bindPopup(x.code);
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("ontCol"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("ontCol", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
  });
  upLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: utilityPoleIcon,
      type: "utilitypole",
      code: x.code,
      name: x.name,
    });
    upLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    tmp.bindPopup(x.code);
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("utilitypoleCol"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("utilitypoleCol", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
  });
  swLC.map((x) => {
    var tmp = L.marker(x.location, {
      icon: sewerIcon,
      type: "sewer",
      code: x.code,
      name: x.name,
    });
    swLayer.addLayer(tmp);
    if (x.name != "") {
      searchLayer.addLayer(tmp);
    }
    tmp.bindPopup(x.code);
    // EVENT
    tmp.on("pm:update", (e) => {
      var { code } = e.target.options;
      var { lat, lng } = e.target._latlng;

      var data = JSON.parse(localStorage.getItem("sewerCol"));
      var x = data.find((x) => x.code == code);
      x.location = [lat, lng];
      localStorage.setItem("sewerCol", JSON.stringify(data));
    });

    myStorage.push({ code: x.code, layer: tmp });
  });
  hideLoading();
}
// SAVE
L.easyButton("fas fa-save", async function (btn, map) {
  showLoading();
  localStorage.setItem("center", JSON.stringify(map.getCenter()));
  map.pm.disableGlobalEditMode();
  //#region
  var popCol = JSON.parse(localStorage.getItem("popCol"));
  var updatePopCol = JSON.parse(localStorage.getItem("updatePopCol"));
  var deletePopCol = JSON.parse(localStorage.getItem("deletePopCol"));

  var mxCol = JSON.parse(localStorage.getItem("mxCol"));
  var updateMxCol = JSON.parse(localStorage.getItem("updateMxCol"));
  var deleteMxCol = JSON.parse(localStorage.getItem("deleteMxCol"));

  var cabinetCol = JSON.parse(localStorage.getItem("cabinetCol"));
  var updateCBCol = JSON.parse(localStorage.getItem("updateCBCol"));
  var deleteCBCol = JSON.parse(localStorage.getItem("deleteCBCol"));

  var cabinetLv1Col = JSON.parse(localStorage.getItem("cabinetLv1Col"));
  var updateCFCol = JSON.parse(localStorage.getItem("updateCFCol"));
  var deleteCFCol = JSON.parse(localStorage.getItem("deleteCFCol"));

  var cabinetLv2Col = JSON.parse(localStorage.getItem("cabinetLv2Col"));
  var updateCSCol = JSON.parse(localStorage.getItem("updateCSCol"));
  var deleteCSCol = JSON.parse(localStorage.getItem("deleteCSCol"));

  var cableCol = JSON.parse(localStorage.getItem("cableCol"));
  var updateCableCol = JSON.parse(localStorage.getItem("updateCableCol"));
  var deleteCableCol = JSON.parse(localStorage.getItem("deleteCableCol"));
  //#endregion
  // POP
  //#region
  if (popCol.length > 0) {
    for (let i = 0; i < popCol.length; i++) {
      const e = popCol[i];
      var data = [
        {
          idTbArea: e.province,
          code: e.code,
          name: e.name,
          description: e.description,
          pos: `[${e.location[0]}, ${e.location[1]}]`,
        },
      ];
      await ajaxPOST(APICollection.POP, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("popCol", JSON.stringify([]));
  }
  if (updatePopCol.length > 0) {
    for (let i = 0; i < updatePopCol.length; i++) {
      const e = updatePopCol[i];
      var data = [
        {
          id: e.id,
          idTbArea: e.idTbArea,
          code: e.code,
          name: e.name,
          description: e.description,
          pos: e.pos,
        },
      ];
      // console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.POP}/${e.id}`, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("updatePopCol", JSON.stringify([]));
  }
  if (deletePopCol.length > 0) {
    for (let i = 0; i < deletePopCol.length; i++) {
      const e = deletePopCol[i];
      await ajaxDELETE(`${APICollection.POP}/${e.id}`);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("deletePopCol", JSON.stringify([]));
  }
  //#endregion
  // MX
  //#region
  if (mxCol.length > 0) {
    for (let i = 0; i < mxCol.length; i++) {
      const e = mxCol[i];
      // FORMAT DATE
      var formatDate = "";
      if (e.date != "") {
        formatDate = moment(e.date, "DD/MM/YYYY").format("YYYY-MM-DD");
      } else {
        formatDate = moment().format("YYYY-MM-DD");
      }
      var data = [
        {
          idTbCable: e.cable,
          rowIndex: e.order,
          idTbPop: e.pop,
          code: e.code,
          name: e.name,
          length: e["length"],
          date: formatDate,
          pos: `[${e.location[0]}, ${e.location[1]}]`,
          status: e.status,
        },
      ];
      // console.log(JSON.stringify(data));
      await ajaxPOST(APICollection.MX, data).then((res) => console.log(res));
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("mxCol", JSON.stringify([]));
  }
  if (updateMxCol.length > 0) {
    for (let i = 0; i < updateMxCol.length; i++) {
      const e = updateMxCol[i];
      var data = [
        {
          id: e.id,
          idTbCable: e.idTbCable,
          rowIndex: e.rowIndex,
          idTbPop: e.idTbPop,
          code: e.code,
          name: e.name,
          length: e["length"],
          date: e.date,
          pos: e.pos,
          status: e.status,
        },
      ];
      console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.MX}/${e.id}`, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("updateMxCol", JSON.stringify([]));
  }
  if (deleteMxCol.length > 0) {
    for (let i = 0; i < deleteMxCol.length; i++) {
      const e = deleteMxCol[i];
      await ajaxDELETE(`${APICollection.MX}/${e.id}`);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("deleteMxCol", JSON.stringify([]));
  }
  //#endregion
  // Cabinet
  //#region
  if (cabinetCol.length > 0) {
    for (let i = 0; i < cabinetCol.length; i++) {
      const element = cabinetCol[i];
      var blockTray = [];
      var preFixName = "TR";
      // if (element.type == 0) {
      //   preFixName = "B";
      // } else if (element.type == 1) {
      //   preFixName = "TR";
      // }

      for (let j = 1; j <= element.block; j++) {
        blockTray.push({
          name: `${element.name}-${preFixName}${j < 10 ? "0" : ""}${j}`,
          totalPort: element.port,
        });
      }

      var message = [
        {
          idTbPop: element.pop,
          code: element.code,
          name: element.name,
          description: element.description,
          note: `${element.type}`,
          index: 0,
          pos: `[${element.location[0]}, ${element.location[1]}]`,
          totalPort: element.block * element.port,
          blockTray,
        },
      ];
      // console.log(message);
      console.log(JSON.stringify(message));
      await ajaxPOST(APICollection.CB, message);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("cabinetCol", JSON.stringify([]));
  }
  if (updateCBCol.length > 0) {
    for (let i = 0; i < updateCBCol.length; i++) {
      const e = updateCBCol[i];
      var data = [
        {
          id: e.id,
          idTbPop: e.idTbPop,
          code: e.code,
          name: e.name,
          totalPortIn: e.totalPortIn,
          totalPortOut: e.totalPortOut,
          description: e.description,
          index: e.index,
          pos: e.pos,
        },
      ];
      console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.CB}/${e.id}`, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("updateCBCol", JSON.stringify([]));
  }
  if (deleteCBCol.length > 0) {
    for (let i = 0; i < deleteCBCol.length; i++) {
      const e = deleteCBCol[i];
      await ajaxDELETE(`${APICollection.CB}/${e.id}`);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("deleteCBCol", JSON.stringify([]));
  }
  //#endregion
  // Cabinet LV1
  //#region
  if (cabinetLv1Col.length > 0) {
    for (let i = 0; i < cabinetLv1Col.length; i++) {
      const element = cabinetLv1Col[i];
      var blockTray = [];
      var preFixName = "TR";
      // if (element.type == 0) {
      //   preFixName = "B";
      // } else if (element.type == 1) {
      //   preFixName = "TR";
      // }
      for (let j = 1; j <= element.block; j++) {
        blockTray.push({
          name: `${element.name}-${preFixName}${j < 10 ? "0" : ""}${j}`,
          totalPort: element.port,
        });
      }

      var message = [
        {
          idTbPop: element.pop,
          code: element.code,
          name: element.name,
          description: element.description,
          note: `${element.type}`,
          index: 1,
          pos: `[${element.location[0]}, ${element.location[1]}]`,
          totalPort: element.block * element.port,
          blockTray,
        },
      ];
      // console.log(message);
      // console.log(JSON.stringify(message));
      await ajaxPOST(APICollection.CB, message);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("cabinetLv1Col", JSON.stringify([]));
  }
  if (updateCFCol.length > 0) {
    for (let i = 0; i < updateCFCol.length; i++) {
      const e = updateCFCol[i];
      var data = [
        {
          id: e.id,
          idTbPop: e.idTbPop,
          code: e.code,
          name: e.name,
          totalPortIn: e.totalPortIn,
          totalPortOut: e.totalPortOut,
          description: e.description,
          index: e.index,
          pos: e.pos,
        },
      ];
      console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.CB}/${e.id}`, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("updateCFCol", JSON.stringify([]));
  }
  if (deleteCFCol.length > 0) {
    for (let i = 0; i < deleteCFCol.length; i++) {
      const e = deleteCFCol[i];
      await ajaxDELETE(`${APICollection.CB}/${e.id}`);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("deleteCFCol", JSON.stringify([]));
  }
  //#endregion
  // Cabinet LV2
  //#region
  if (cabinetLv2Col.length > 0) {
    for (let i = 0; i < cabinetLv2Col.length; i++) {
      const element = cabinetLv2Col[i];
      var blockTray = [];
      var preFixName = "TR";
      // if (element.type == 0) {
      //   preFixName = "B";
      // } else if (element.type == 1) {
      //   preFixName = "TR";
      // }
      for (let j = 1; j <= element.block; j++) {
        blockTray.push({
          name: `${element.name}-${preFixName}${j < 10 ? "0" : ""}${j}`,
          totalPort: element.port,
        });
      }

      var message = [
        {
          idTbPop: element.pop,
          code: element.code,
          name: element.name,
          description: element.description,
          note: `${element.type}`,
          index: 2,
          pos: `[${element.location[0]}, ${element.location[1]}]`,
          totalPort: element.block * element.port,
          blockTray,
        },
      ];
      // console.log(message);
      // console.log(JSON.stringify(message));
      await ajaxPOST(APICollection.CB, message);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("cabinetLv2Col", JSON.stringify([]));
  }
  if (updateCSCol.length > 0) {
    for (let i = 0; i < updateCSCol.length; i++) {
      const e = updateCSCol[i];
      var data = [
        {
          id: e.id,
          idTbPop: e.idTbPop,
          code: e.code,
          name: e.name,
          totalPortIn: e.totalPortIn,
          totalPortOut: e.totalPortOut,
          description: e.description,
          index: e.index,
          pos: e.pos,
        },
      ];
      console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.CB}/${e.id}`, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("updateCSCol", JSON.stringify([]));
  }
  if (deleteCSCol.length > 0) {
    for (let i = 0; i < deleteCSCol.length; i++) {
      const e = deleteCSCol[i];
      await ajaxDELETE(`${APICollection.CB}/${e.id}`);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("deleteCSCol", JSON.stringify([]));
  }
  //#endregion
  // Cable
  //#region
  if (cableCol.length > 0) {
    for (let i = 0; i < cableCol.length; i++) {
      const e = cableCol[i];
      var posArray = [];
      for (let i = 0; i < e.breakPoints.length; i++) {
        const x = e.breakPoints[i];
        posArray.push(`[${x[0]}, ${x[1]}]`);
      }
      var formatDate = "";
      if (e.date != "") {
        formatDate = moment(e.date, "DD/MM/YYYY").format("YYYY-MM-DD");
      } else {
        formatDate = moment().format("YYYY-MM-DD");
      }
      var start = e.start != "" ? e.start.split("-") : undefined;
      var end = e.start != "" ? e.end.split("-") : undefined;
      var data = [
        {
          iD_tbCableType: e.type,
          code: e.code,
          name: e.name,
          connect: e.connection,
          capacity: e.capacity,
          length: e["length"],
          reference: e.reference,
          completeDate: formatDate,
          posBegin: `[${e.breakPoints[0][0]}, ${e.breakPoints[0][1]}]`,
          posEnd: `[${e.breakPoints[e.breakPoints.length - 1][0]}, ${
            e.breakPoints[e.breakPoints.length - 1][1]
          }]`,
          id_tbPOP: e.pop,
          iD_tbCableAttribute: 1,
          posArray: `[${posArray}]`,
          idObjectBegin: start != undefined ? parseInt(start[1]) : 0,
          nameObjectBegin: start != undefined ? start[0] : "",
          idObjectEnd: end != undefined ? parseInt(end[1]) : 0,
          nameObjectEnd: end != undefined ? end[0] : "",
          totalCore: e.capacity,
          typeCableArray: JSON.stringify(e.render),
        },
      ];
      console.log(JSON.stringify(data));
      await ajaxPOST(APICollection.Cable, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("cableCol", JSON.stringify([]));
  }
  if (updateCableCol.length > 0) {
    for (let i = 0; i < updateCableCol.length; i++) {
      const e = updateCableCol[i];
      var data = [
        {
          id: e.id,
          iD_tbCableType: e.iD_tbCableType,
          code: e.code,
          name: e.name,
          connect: e.connect,
          capacity: e.capacity,
          length: e["length"],
          reference: e.reference,
          completeDate: e.completeDate,
          posBegin: e.posBegin,
          posEnd: e.posEnd,
          id_tbPOP: e.id_tbPOP,
          iD_tbCableAttribute: 1,
          posArray: e.posArray,
          idObjectBegin: e.idObjectBegin,
          nameObjectBegin: e.nameObjectBegin,
          idObjectEnd: e.idObjectEnd,
          nameObjectEnd: e.nameObjectEnd,
          totalCore: e.capacity,
          typeCableArray: e.typeCableArray,
        },
      ];
      // console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.Cable}/${e.id}`, data);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("updateCableCol", JSON.stringify([]));
  }
  if (deleteCableCol.length > 0) {
    for (let i = 0; i < deleteCableCol.length; i++) {
      const e = deleteCableCol[i];
      await ajaxDELETE(`${APICollection.Cable}/${e.id}`);
    }

    // Chỗ này làm biếng làm nên mới xóa toàn bộ, chứ thật ra phải xóa từng thằng
    localStorage.setItem("deleteCableCol", JSON.stringify([]));
  }
  //#endregion
  hideLoading();
  toastSuccess("Lưu vào hệ thống thành công!");
  setTimeout(() => {
    location.reload();
  }, 1000);
}).addTo(map);

// draw
map.on("draw:created", function (e) {
  var type = e.layerType;
  var { lat, lng } = e.layer._latlng;
  var layer = e.layer;

  switch (type) {
    case "pop": {
      var code = generateCode("PO");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "pop";

      layer.bindPopup(
        `
          <div class='d-flex flex-column justify-content-center'>
            <div class='d-flex justify-content-center'><b>Thông tin của POP</b></div>
            <div class='d-flex justify-content-center mt-1'>
              <button type="button" class="btn btn-info mr-1" onClick="showPopModal(
                '', '${code}')">Edit</button>
          </div>
          <div>
            <table class="table table-dark table-striped table-bordered">
              <tbody>
                <tr style="display: none;">
                  <td>Code</td>
                  <td>${code}</td>
                </tr>
                <tr>
                  <td>Tên POP</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mô tả</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>      
      `,
        { className: "popupCable", minWidth: 270 }
      );

      // map.addLayer(layer);
      popLayer.addLayer(layer);

      var popCol = JSON.parse(localStorage.getItem("popCol"));
      popCol.push({
        id: "",
        code,
        location: [lat, lng],
        name: "",
        description: "",
        province: 0,
      });

      localStorage.setItem("popCol", JSON.stringify(popCol));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("popCol"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("popCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "cabinet": {
      var code = generateCode("CB");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "cabinet";

      layer.bindPopup(
        `
          <div class='d-flex flex-column justify-content-center'>
            <div class='d-flex justify-content-center'><b>Thông tin của Cabinet</b></div>
            <div class='d-flex justify-content-center mt-1'>
              <button type="button" class="btn btn-info mr-1" onClick="showCbMD(
                '', '${code}')">Edit</button>
          </div>
          <div>
            <table class="table table-dark table-striped table-bordered">
              <tbody>
                <tr style="display: none;">
                  <td>Code</td>
                  <td>${code}</td>
                </tr>
                <tr>
                  <td>Tên Cabinet</td>
                  <td></td>
                </tr>
                <tr>
                  <td>In/Used</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Out/Used</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mô tả</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>`,
        { className: "popupCable", minWidth: 270 }
      );

      // map.addLayer(layer);
      cbLayer.addLayer(layer);

      var cabinetCol = JSON.parse(localStorage.getItem("cabinetCol"));
      cabinetCol.push({
        id: "",
        pop: 0,
        code,
        location: [lat, lng],
        name: "",
        type: 0,
        block: 1,
        port: 12,
        description: "",
        index: 0,
      });
      localStorage.setItem("cabinetCol", JSON.stringify(cabinetCol));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("cabinetCol"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("cabinetCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "cabinetlv1": {
      var code = generateCode("CF");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "cabinet";

      layer.bindPopup(
        `
          <div class='d-flex flex-column justify-content-center'>
            <div class='d-flex justify-content-center'><b>Thông tin của Cabinet Level 1</b></div>
            <div class='d-flex justify-content-center mt-1'>
              <button type="button" class="btn btn-info mr-1" onClick="showCb1MD(
                '', '${code}')">Edit</button>
          </div>
          <div>
            <table class="table table-dark table-striped table-bordered">
              <tbody>
                <tr style="display: none;">
                  <td>Code</td>
                  <td>${code}</td>
                </tr>
                <tr>
                  <td>Tên Cabinet Level 1</td>
                  <td></td>
                </tr>
                <tr>
                  <td>In/Used</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Out/Used</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mô tả</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>`,
        { className: "popupCable", minWidth: 270 }
      );

      // map.addLayer(layer);
      cfLayer.addLayer(layer);

      var cabinetLv1Col = JSON.parse(localStorage.getItem("cabinetLv1Col"));
      cabinetLv1Col.push({
        id: "",
        pop: 0,
        code,
        location: [lat, lng],
        name: "",
        type: 0,
        block: 1,
        port: 12,
        description: "",
        index: 1,
      });
      localStorage.setItem("cabinetLv1Col", JSON.stringify(cabinetLv1Col));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("cabinetLv1Col"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("cabinetLv1Col", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "cabinetlv2": {
      var code = generateCode("CS");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "cabinet";

      layer.bindPopup(
        `
          <div class='d-flex flex-column justify-content-center'>
            <div class='d-flex justify-content-center'><b>Thông tin của Cabinet Level 2</b></div>
            <div class='d-flex justify-content-center mt-1'>
              <button type="button" class="btn btn-info mr-1" onClick="showCb2MD(
                '', '${code}')">Edit</button>
          </div>
          <div>
            <table class="table table-dark table-striped table-bordered">
              <tbody>
                <tr style="display: none;">
                  <td>Code</td>
                  <td>${code}</td>
                </tr>
                <tr>
                  <td>Tên Cabinet Level 2</td>
                  <td></td>
                </tr>
                <tr>
                  <td>In/Used</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Out/Used</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mô tả</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>`,
        { className: "popupCable", minWidth: 270 }
      );

      // map.addLayer(layer);
      csLayer.addLayer(layer);

      var cabinetLv2Col = JSON.parse(localStorage.getItem("cabinetLv2Col"));
      cabinetLv2Col.push({
        id: "",
        pop: 0,
        code,
        location: [lat, lng],
        name: "",
        type: 0,
        block: 1,
        port: 12,
        description: "",
        index: 2,
      });
      localStorage.setItem("cabinetLv2Col", JSON.stringify(cabinetLv2Col));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("cabinetLv2Col"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("cabinetLv2Col", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "mx": {
      var code = generateCode("MX");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "mx";

      layer.bindPopup(
        `
          <div class='d-flex flex-column justify-content-center'>
            <div class='d-flex justify-content-center'><b>Thông tin về măng xông</b></div>
            <div class='d-flex justify-content-center mt-1'>
              <button type="button" class="btn btn-info mr-1" onClick="showMxModal(
                '', '${code}')">Edit</button>
          </div>
          <div>
            <table class="table table-dark table-striped table-bordered">
              <tbody>
                <tr style="display: none;">
                  <td>Code</td>
                  <td>${code}</td>
                </tr>
                <tr>
                  <td>Ký hiệu măng xông</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Chiều dài đoạn cáp</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Ngày lắp đặt</td>
                  <td></td>
                </tr>
              </tbody>
            </table>    
          </div>`,
        { className: "popupCable", minWidth: 300 }
      );

      // map.addLayer(layer);
      mxLayer.addLayer(layer);

      var mxCol = JSON.parse(localStorage.getItem("mxCol"));
      mxCol.push({
        id: "",
        code,
        location: [lat, lng],
        name: "",
        length: 1,
        date: "",
        pop: 0,
        cable: 0,
        order: 1,
        status: 0,
        image: "",
      });
      localStorage.setItem("mxCol", JSON.stringify(mxCol));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("mxCol"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("mxCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "ont": {
      var code = generateCode("OT");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "ont";

      layer.bindPopup(code);

      // map.addLayer(layer);
      ontLayer.addLayer(layer);

      var ontCol = JSON.parse(localStorage.getItem("ontCol"));
      ontCol.push({
        id: "",
        code,
        location: [lat, lng],
        name: "",
        pop: 0,
      });
      localStorage.setItem("ontCol", JSON.stringify(ontCol));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("ontCol"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("ontCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "utilitypole": {
      var code = generateCode("UP");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "utilitypole";

      layer.bindPopup(code);

      // map.addLayer(layer);
      upLayer.addLayer(layer);

      var utilitypoleCol = JSON.parse(localStorage.getItem("utilitypoleCol"));
      utilitypoleCol.push({
        id: "",
        code,
        location: [lat, lng],
        name: "",
      });
      localStorage.setItem("utilitypoleCol", JSON.stringify(utilitypoleCol));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("utilitypoleCol"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("utilitypoleCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    case "sewer": {
      var code = generateCode("SW");
      layer.options.id = "";
      layer.options.code = code;
      layer.options.type = "sewer";

      layer.bindPopup(code);

      // map.addLayer(layer);
      swLayer.addLayer(layer);

      var sewerCol = JSON.parse(localStorage.getItem("sewerCol"));
      sewerCol.push({
        id: "",
        code,
        location: [lat, lng],
        name: "",
      });
      localStorage.setItem("sewerCol", JSON.stringify(sewerCol));

      layer.on("pm:update", (e) => {
        var { code } = e.target.options;
        var { lat, lng } = e.target._latlng;

        var data = JSON.parse(localStorage.getItem("sewerCol"));
        var x = data.find((x) => x.code == code);
        x.location = [lat, lng];
        localStorage.setItem("sewerCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer });

      break;
    }
    default:
      break;
  }
});
// geoman
map.on("pm:create", (e) => {
  var _latlngs = e.layer._latlngs;
  for (let i = 0; i < _latlngs.length - 1; i++) {
    var x = _latlngs[i];
    var y = _latlngs[i + 1];
    var u = markerStorage.find(
      (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(x)
    );
    var v = markerStorage.find(
      (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(y)
    );
    console.log("Điểm đầu: ", u);
    console.log("Điểm cuối: ", v);
    if (u != undefined && v != undefined) {
      var code = generateCode("CA");
      var tmp = {
        id: "",
        code,
        name: "",
        connection: "",
        capacity: 1,
        length: 1,
        reference: "",
        date: "",
        type: 1,
        attribute: 2,
        pop: 0,
        start:
          u != undefined ? `${u.layer.options.type}-${u.layer.options.id}` : "",
        end:
          v != undefined ? `${v.layer.options.type}-${v.layer.options.id}` : "",
        breakPoints: [
          [x.lat, x.lng],
          [y.lat, y.lng],
        ],
        render: [
          {
            attribute: 1,
          },
        ],
      };
      var polyline = L.polyline(
        [
          [x.lat, x.lng],
          [y.lat, y.lng],
        ],
        {
          id: "",
          code,
          type: "cable",
          className: "captruc",
        }
      );
      polyline.bindPopup(
        `
      <div class='d-flex flex-column justify-content-center'>
        <div class='d-flex justify-content-center'><b>Thông tin tuyến cáp</b></div>
        <div class='d-flex justify-content-center mt-2'>            
          <button type="button" class="btn btn-info mr-1" onClick="showCableMD('', '${code}')">Edit</button>
        </div>          
      </div>
      <div>
        <table class="table table-dark table-striped table-bordered">
          <tbody>
            <tr>
              <td>Code</td>
              <td>${code}</td>
            </tr>
            <tr>
              <td>Ký hiệu tuyến quang</td>
              <td></td>
            </tr>
            <tr>
              <td>Kết nối</td>
              <td></td>
            </tr>
            <tr>
              <td>Dung lượng sợi</td>
              <td></td>
            </tr>
            <tr>
              <td>Chiều dài toàn tuyến</td>
              <td></td>
            </tr>
            <tr>
              <td>Mã cáp NXS</td>
              <td></td>
            </tr>
            <tr>
              <td>Thời gian xây dựng</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      `,
        { className: "popupCable", minWidth: 270, snapIgnore: true }
      );
      // EVENT
      polyline.on("pm:update", (e) => {
        var { code } = e.target.options;
        var _latlngs = e.target._latlngs;
        // console.log(_latlngs);
        var breakPoints = [];
        for (let i = 0; i < _latlngs.length; i++) {
          var { lat, lng } = _latlngs[i];
          breakPoints.push([lat, lng]);
        }
        var render = [];
        for (let i = 0; i < _latlngs.length - 1; i++) {
          render.push({
            attribute: 1,
          });
        }
        var a = _latlngs[0];
        var b = _latlngs[_latlngs.length - 1];
        var c = markerStorage.find(
          (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(a)
        );
        var d = markerStorage.find(
          (m) => JSON.stringify(m.layer._latlng) === JSON.stringify(b)
        );

        var data = JSON.parse(localStorage.getItem("cableCol"));
        var x = data.find((x) => x.code == code);
        x.breakPoints = breakPoints;
        x.render = render;
        x.start =
          c != undefined ? `${c.layer.options.type}-${c.layer.options.id}` : "";
        x.end =
          d != undefined ? `${d.layer.options.type}-${d.layer.options.id}` : "";
        localStorage.setItem("cableCol", JSON.stringify(data));
      });

      myStorage.push({ code, layer: polyline });
      cableStorage.push({ code, layer: polyline });

      var cableCol = JSON.parse(localStorage.getItem("cableCol"));
      cableCol.push(tmp);
      localStorage.setItem("cableCol", JSON.stringify(cableCol));

      polyline.addTo(map);
    } else {
      alert("Tuyến cáp bạn vừa vẽ không có điểm đầu, điểm cuối. Hãy vẽ lại!");
    }
  }

  map.removeLayer(e.layer);
});

// REMOVE
map.on("pm:remove", (e) => {
  var { type, code, id } = e.layer.options;
  switch (type) {
    case "cable": {
      if (id == "") {
        var cableCol = JSON.parse(localStorage.getItem("cableCol"));
        cableCol.splice(
          cableCol.findIndex((x) => x.code == code),
          1
        );
        localStorage.setItem("cableCol", JSON.stringify(cableCol));
      } else {
        var index = cableDB.findIndex((p) => p.code == code);
        cableDB.splice(index, 1);

        var updateCableCol = JSON.parse(localStorage.getItem("updateCableCol"));
        var check = updateCableCol.findIndex(
          (u) => u.code == cableDB[index].code
        );
        if (check != -1) {
          updateCableCol.splice(check, 1);
        }
        localStorage.setItem("updateCableCol", JSON.stringify(updateCableCol));

        var deleteCableCol = JSON.parse(localStorage.getItem("deleteCableCol"));
        deleteCableCol.push({ id });
        localStorage.setItem("deleteCableCol", JSON.stringify(deleteCableCol));
      }
      var decorations = decorationStorage.filter((d) => d.code == code);
      decorations.map((o) => map.removeLayer(o.layer));
      break;
    }
    case "pop": {
      if (id == "") {
        var popCol = JSON.parse(localStorage.getItem("popCol"));
        popCol.splice(
          popCol.findIndex((x) => (x.code = code)),
          1
        );
        localStorage.setItem("popCol", JSON.stringify(popCol));
      } else {
        var index = popDB.findIndex((p) => p.code == code);
        popDB.splice(index, 1);

        var updatePopCol = JSON.parse(localStorage.getItem("updatePopCol"));
        var check = updatePopCol.findIndex((u) => u.code == popDB[index].code);
        if (check != -1) {
          updatePopCol.splice(check, 1);
        }
        localStorage.setItem("updatePopCol", JSON.stringify(updatePopCol));

        var deletePopCol = JSON.parse(localStorage.getItem("deletePopCol"));
        deletePopCol.push({ id });
        localStorage.setItem("deletePopCol", JSON.stringify(deletePopCol));
      }
      break;
    }
    case "cabinet": {
      if (id == "") {
        var cabinetCol = JSON.parse(localStorage.getItem("cabinetCol"));
        cabinetCol.splice(
          cabinetCol.findIndex((x) => (x.code = code)),
          1
        );
        localStorage.setItem("cabinetCol", JSON.stringify(cabinetCol));
      } else {
        var index = cbDB.findIndex((p) => p.code == code);
        cbDB.splice(index, 1);

        var updateCBCol = JSON.parse(localStorage.getItem("updateCBCol"));
        var check = updateCBCol.findIndex((u) => u.code == cbDB[index].code);
        if (check != -1) {
          updateCBCol.splice(check, 1);
        }
        localStorage.setItem("updateCBCol", JSON.stringify(updateCBCol));

        var deleteCBCol = JSON.parse(localStorage.getItem("deleteCBCol"));
        deleteCBCol.push({ id });
        localStorage.setItem("deleteCBCol", JSON.stringify(deleteCBCol));
      }
      break;
    }
    case "cabinetlv1": {
      if (id == "") {
        var cabinetLv1Col = JSON.parse(localStorage.getItem("cabinetLv1Col"));
        cabinetLv1Col.splice(
          cabinetLv1Col.findIndex((x) => (x.code = code)),
          1
        );
        localStorage.setItem("cabinetLv1Col", JSON.stringify(cabinetLv1Col));
      } else {
        var index = cbDB.findIndex((p) => p.code == code);
        cbDB.splice(index, 1);

        var updateCFCol = JSON.parse(localStorage.getItem("updateCFCol"));
        var check = updateCFCol.findIndex((u) => u.code == cbDB[index].code);
        if (check != -1) {
          updateCFCol.splice(check, 1);
        }
        localStorage.setItem("updateCFCol", JSON.stringify(updateCFCol));

        var deleteCFCol = JSON.parse(localStorage.getItem("deleteCFCol"));
        deleteCFCol.push({ id });
        localStorage.setItem("deleteCFCol", JSON.stringify(deleteCFCol));
      }
      break;
    }
    case "cabinetlv2": {
      if (id == "") {
        var cabinetLv2Col = JSON.parse(localStorage.getItem("cabinetLv2Col"));
        cabinetLv2Col.splice(
          cabinetLv2Col.findIndex((x) => (x.code = code)),
          1
        );
        localStorage.setItem("cabinetLv2Col", JSON.stringify(cabinetLv2Col));
      } else {
        var index = cbDB.findIndex((p) => p.code == code);
        cbDB.splice(index, 1);

        var updateCSCol = JSON.parse(localStorage.getItem("updateCSCol"));
        var check = updateCSCol.findIndex((u) => u.code == cbDB[index].code);
        if (check != -1) {
          updateCSCol.splice(check, 1);
        }
        localStorage.setItem("updateCSCol", JSON.stringify(updateCSCol));

        var deleteCSCol = JSON.parse(localStorage.getItem("deleteCSCol"));
        deleteCSCol.push({ id });
        localStorage.setItem("deleteCSCol", JSON.stringify(deleteCSCol));
      }
      break;
    }
    case "mx": {
      if (id == "") {
        var mxCol = JSON.parse(localStorage.getItem("mxCol"));
        mxCol.splice(
          mxCol.findIndex((x) => (x.code = code)),
          1
        );
        localStorage.setItem("mxCol", JSON.stringify(mxCol));
      } else {
        var index = mxDB.findIndex((p) => p.code == code);
        mxDB.splice(index, 1);

        var updateMxCol = JSON.parse(localStorage.getItem("updateMxCol"));
        var check = updateMxCol.findIndex((u) => u.code == mxDB[index].code);
        if (check != -1) {
          updateMxCol.splice(check, 1);
        }
        localStorage.setItem("updateMxCol", JSON.stringify(updateMxCol));

        var deleteMxCol = JSON.parse(localStorage.getItem("deleteMxCol"));
        deleteMxCol.push({ id });
        localStorage.setItem("deleteMxCol", JSON.stringify(deleteMxCol));
      }
      break;
    }
    case "ont": {
      var ontCol = JSON.parse(localStorage.getItem("ontCol"));
      ontCol.splice(
        ontCol.findIndex((x) => (x.code = code)),
        1
      );
      localStorage.setItem("ontCol", JSON.stringify(ontCol));
      break;
    }
    case "utilitypole": {
      var utilitypoleCol = JSON.parse(localStorage.getItem("utilitypoleCol"));
      utilitypoleCol.splice(
        utilitypoleCol.findIndex((x) => (x.code = code)),
        1
      );
      localStorage.setItem("utilitypoleCol", JSON.stringify(utilitypoleCol));
      break;
    }
    case "sewer": {
      var sewerCol = JSON.parse(localStorage.getItem("sewerCol"));
      sewerCol.splice(
        sewerCol.findIndex((x) => (x.code = code)),
        1
      );
      localStorage.setItem("sewerCol", JSON.stringify(sewerCol));
      break;
    }
    default:
      break;
  }
});

map.on("overlayadd", async (event) => {
  if (event.name == "ONT") {
    if (ontDB == undefined) {
      showLoading();
      ontDB = await ajaxGET(APICollection.TicketCustomer);
      drawOntDB();
      hideLoading();
    }
  }
});

async function loadSPEP(start, end) {
  var startSplit = start.split("-"),
    endSplit = end.split("-");
  if (startSplit[0] == "cabinet") {
    var s = cbDB.find((c) => c.id == startSplit[1]);
    var option = `<option value="cabinet-${s.id}">${s.name}</option>`;
    $("#cableMD .start").append(option);
    $("#cableMD .end").append(option);
  } else if (startSplit[0] == "pop") {
    var s = popDB.find((p) => p.id == startSplit[1]);
    var option = `<option value="pop-${s.id}">${s.name}</option>`;
    $("#cableMD .start").append(option);
    $("#cableMD .end").append(option);
  } else if (startSplit[0] == "mx") {
    var s = mxDB.find((m) => m.id == startSplit[1]);
    var option = `<option value="mx-${s.id}">${s.name}</option>`;
    $("#cableMD .start").append(option);
    $("#cableMD .end").append(option);
  }

  if (endSplit[0] == "cabinet") {
    var s = cbDB.find((c) => c.id == endSplit[1]);
    var option = `<option value="cabinet-${s.id}">${s.name}</option>`;
    $("#cableMD .start").append(option);
    $("#cableMD .end").append(option);
  } else if (endSplit[0] == "pop") {
    var s = popDB.find((p) => p.id == endSplit[1]);
    var option = `<option value="pop-${s.id}">${s.name}</option>`;
    $("#cableMD .start").append(option);
    $("#cableMD .end").append(option);
  } else if (endSplit[0] == "mx") {
    var s = mxDB.find((m) => m.id == endSplit[1]);
    var option = `<option value="mx-${s.id}">${s.name}</option>`;
    $("#cableMD .start").append(option);
    $("#cableMD .end").append(option);
  }
}

// TOPBAR
$("#popTB").on("select2:select", function (e) {
  const data = e.params.data;
  myStorage.map((o) => map.removeLayer(o.layer));
  decorationStorage.map((d) => map.removeLayer(d.layer));
  drawByMySelf(data.id);

  var pop = popDB.find((p) => p.id == data.id);
  map.flyTo(JSON.parse(pop.pos), 15);
});
