// SHOW CABLE MODAL
async function showCableMD(id, code) {
  // $("#cableMD .copy").append(`<option value=""></option>`);
  // cableLC = JSON.parse(localStorage.getItem("cableCol"));
  // for (let i = 0; i < cableLC.length; i++) {
  //   const element = cableLC[i];
  //   var option = `<option value="${element.code}">${element.name}</option>`;
  //   $("#cableMD .copy").append(option);
  // }
  // for (let i = 0; i < cableDB.length; i++) {
  //   const element = cableDB[i];
  //   var option = `<option value="${element.code}">${element.name}</option>`;
  //   $("#cableMD .copy").append(option);
  // }
  // $("#cableMD .copy").val("").trigger("change");

  if (id == "") {
    cableLC = JSON.parse(localStorage.getItem("cableCol"));
    const cable = cableLC.find((c) => c.code == code);

    $("#cableMD .id").val(cable.id);
    $("#cableMD .code").val(cable.code);
    $("#cableMD .name").val(cable.name);
    $("#cableMD .connection").val(cable.connection);
    $("#cableMD .capacity").val(cable.capacity);
    $("#cableMD .length").val(cable.length);
    $("#cableMD .reference").val(cable.reference);
    if (cable.date == "") {
      $("#cableMD .date").val();
    } else {
      $('#cableMD input[name="date"]')
        .data("daterangepicker")
        .setStartDate(cable.date);
      $('#cableMD input[name="date"]')
        .data("daterangepicker")
        .setEndDate(cable.date);
    }
    $("#cableMD .type")
      .val(cable.type)
      .trigger("change")
      .prop("disabled", false);
    // if (cable.type == 1) {
    //   $("#cableMD .pop").prop("disabled", true);
    // } else {
    //   $("#cableMD .pop").val(cable.pop).trigger("change");
    // }
    $("#cableMD .pop").val(cable.pop).trigger("change").prop("disabled", false);

    await loadSPEP(cable.start, cable.end);
    $("#cableMD .start").val(cable.start).trigger("change");
    $("#cableMD .end").val(cable.end).trigger("change");
    for (let i = 0; i < cable.render.length; i++) {
      const element = cable.render[i];
      var tmp = `
        <div class="form-row selectAttribute">
            <div class="form-group col-md-6">
                <input type="text" name="" class="form-control" value="Đoạn ${
                  i + 1
                }" disabled>
            </div>
            <div class="form-group col-md-6">
                <select class="form-control attribute" name="attribute" required>
                </select>
            </div>
        </div>
        `;
      $("#mutiple-attribute").append(tmp);
    }
    for (let i = 0; i < LISTATTRIBUTES.length; i++) {
      const e = LISTATTRIBUTES[i];
      var option = `<option value="${e.id}">${e.name}</option>`;
      $(".attribute").append(option);
    }
    var tmp = 0;
    for (let i = 0; i < cable.render.length; i++) {
      const element = cable.render[i];

      var child = $(
        `#mutiple-attribute .selectAttribute:nth-child(${tmp + 1})`
      );
      child.find(".attribute").val(element.attribute).trigger("change");
      tmp++;
    }

    $("#cableMD").modal("show");
  } else {
    const cable = cableDB.find((c) => c.id == id);
    $("#cableMD .id").val(cable.id);
    $("#cableMD .code").val(cable.code);
    $("#cableMD .name").val(cable.name);
    $("#cableMD .connection").val(cable.connect);
    $("#cableMD .capacity").val(cable.capacity);
    $("#cableMD .length").val(cable["length"]);
    $("#cableMD .reference").val(cable.reference);
    var formatDate = moment(cable.completeDate).format("DD/MM/YYYY"),
      start = `${cable.nameObjectBegin}-${cable.idObjectBegin}`,
      end = `${cable.nameObjectEnd}-${cable.idObjectEnd}`;
    $('#cableMD input[name="date"]')
      .data("daterangepicker")
      .setStartDate(formatDate);
    $('#cableMD input[name="date"]')
      .data("daterangepicker")
      .setEndDate(formatDate);
    $("#cableMD .type")
      .val(cable.iD_tbCableType)
      .trigger("change")
      .prop("disabled", true);
    if (cable.iD_tbCableType == 1) {
      $("#cableMD .pop").prop("disabled", true);
    } else {
      $("#cableMD .pop").val(cable.id_tbPOP).trigger("change");
    }

    await loadSPEP(start, end);
    $("#cableMD .start").val(start).trigger("change");
    $("#cableMD .end").val(end).trigger("change");
    const render = JSON.parse(cable.typeCableArray);
    for (let i = 0; i < render.length; i++) {
      const element = render[i];
      var tmp = `
        <div class="form-row selectAttribute">
            <div class="form-group col-md-6">
                <input type="text" name="" class="form-control" value="Đoạn ${
                  i + 1
                }" disabled>
            </div>
            <div class="form-group col-md-6">
                <select class="form-control attribute" name="attribute">
                    <option value=""></option>
                </select>
            </div>
        </div>
        `;
      $("#mutiple-attribute").append(tmp);
    }
    for (let i = 0; i < LISTATTRIBUTES.length; i++) {
      const e = LISTATTRIBUTES[i];
      var option = `<option value="${e.id}">${e.name}</option>`;
      $(".attribute").append(option);
    }
    var tmp = 0;
    for (let i = 0; i < render.length; i++) {
      const element = render[i];

      var child = $(
        `#mutiple-attribute .selectAttribute:nth-child(${tmp + 1})`
      );
      child.find(".attribute").val(element.attribute);
      tmp++;
    }

    $("#cableMD").modal("show");
  }
}

// Copy dữ liệu từ tuyến khác
$("#cableMD .copy").on("select2:select", async function (e) {
  const { id: code } = e.params.data;
  var a = await cableLC.find((c) => c.code == code);
  var b = await cableDB.find((d) => d.code == code);
  if (a != undefined) {
    $("#cableMD .name").val(a.name);
    $("#cableMD .connection").val(a.connection);
    $("#cableMD .capacity").val(a.capacity);
    $("#cableMD .reference").val(a.reference);
    if (a.date == "") {
      $("#cableMD .date").val();
    } else {
      $('#cableMD input[name="date"]')
        .data("daterangepicker")
        .setStartDate(a.date);
      $('#cableMD input[name="date"]')
        .data("daterangepicker")
        .setEndDate(a.date);
    }
    $("#cableMD .type").val(a.type).trigger("change");
    $("#cableMD .pop").val(a.pop).trigger("change");
  } else {
    $("#cableMD .name").val(b.name);
    $("#cableMD .connection").val(b.connect);
    $("#cableMD .capacity").val(b.capacity);
    $("#cableMD .length").val(b["length"]);
    $("#cableMD .reference").val(b.reference);
    var formatDate = moment(b.completeDate).format("DD/MM/YYYY");
    $('#cableMD input[name="date"]')
      .data("daterangepicker")
      .setStartDate(formatDate);
    $('#cableMD input[name="date"]')
      .data("daterangepicker")
      .setEndDate(formatDate);
    $("#cableMD .type").val(b.iD_tbCableType).trigger("change");

    $("#cableMD .pop").val(b.id_tbPOP).trigger("change");
  }
});
// Disable chọn pop khi chọn cáp trục
$("#cableMD .type").on("select2:select", async function (e) {
  const { id } = e.params.data;
  if (id == 1) {
    $("#cableMD .pop").prop("disabled", true).val("0").trigger("change");
  } else {
    $("#cableMD .pop").prop("disabled", false);
  }
});

// SHOW DETAIL CORE MODAL
function cableDetail(id, type) {
  if (type == 1) {
    window.open(
      `${MAINURL}/device-management/managed-cables/tt/?cableId=${id}`
    );
  } else if (type == 2) {
    window.open(
      `${MAINURL}/device-management/managed-cables/tn/?cableId=${id}`
    );
  }
}

// SHOW POP MODAL
function showPopModal(id, code) {
  if (id == "") {
    const pop = popLC.find((p) => p.code == code);
    $("#popModal .id").val(pop.id);
    $("#popModal .code").val(pop.code);
    $("#popModal .name").val(pop.name);
    $("#popModal .desc").val(pop.description);
    $("#popModal .province").val(pop.province).trigger("change");
  } else {
    const pop = popDB.find((p) => p.id == id);
    $("#popModal .id").val(pop.id);
    $("#popModal .code").val(pop.code);
    $("#popModal .name").val(pop.name);
    $("#popModal .desc").val(pop.description);
    $("#popModal .province").val(pop.idTbArea).trigger("change");
  }
  $("#popModal").modal("show");
}
// SHOW DETAIL POP
async function popDetail(id) {
  window.open(`${MAINURL}/device-management/managed-pops/?popId=${id}`);
}

// SHOW MX MODAL
function showMxModal(id, code) {
  if (id == "") {
    mxLC = JSON.parse(localStorage.getItem("mxCol"));
    const mx = mxLC.find((c) => c.code == code);
    $("#mxModal .id").val(mx.id);
    $("#mxModal .code").val(mx.code);
    $("#mxModal .name").val(mx.name);
    $("#mxModal .length").val(mx["length"]);
    if (mx.image != "") {
      $("#mxModal #preview").attr("src", `${mx.image}`);
    } else {
      $("#mxModal #preview").attr("src", "https://placehold.it/80x80");
    }
    if (mx.date == "") {
      $("#mxModal .date").val();
    } else {
      $('#mxModal input[name="date"]')
        .data("daterangepicker")
        .setStartDate(mx.date);
      $('#mxModal input[name="date"]')
        .data("daterangepicker")
        .setEndDate(mx.date);
    }
    if (mx.status == 0) {
      $("#mxModal #old").prop("checked", true);
    } else {
      $("#mxModal #new").prop("checked", true);
    }

    $("#mxModal .cable").empty().append("<option></option>");
    for (let i = 0; i < cableDB.length; i++) {
      const element = cableDB[i];
      var option = `<option value="${element.id}">${element.name}</option>`;
      $("#mxModal .cable").append(option);
    }
    $("#mxModal .cable").val(mx.cable).trigger("change");
    $("#mxModal .order").val(mx.order).trigger("change");

    $("#mxModal .pop").val(mx.pop).trigger("change");
  } else {
    const mx = mxDB.find((m) => m.id == id);
    $("#mxModal .id").val(mx.id);
    $("#mxModal .code").val(mx.code);
    $("#mxModal .name").val(mx.name);
    $("#mxModal .length").val(mx["length"]);

    $("#mxModal #preview").attr("src", "https://placehold.it/80x80");

    var formatDate = moment(mx.date).format("DD/MM/YYYY");
    $('#mxModal input[name="date"]')
      .data("daterangepicker")
      .setStartDate(formatDate);
    $('#mxModal input[name="date"]')
      .data("daterangepicker")
      .setEndDate(formatDate);

    if (mx.status == 0) {
      $("#mxModal #old").prop("checked", true);
    } else {
      $("#mxModal #new").prop("checked", true);
    }
    $("#mxModal .pop").val(mx.idTbPop).trigger("change");

    $("#mxModal .cable").empty().append("<option></option>");
    for (let i = 0; i < cableDB.length; i++) {
      const element = cableDB[i];
      var option = `<option value="${element.id}">${element.name}</option>`;
      $("#mxModal .cable").append(option);
    }
    $("#mxModal .cable").val(mx.idTbCable).trigger("change");

    $("#mxModal .order").val(mx.rowIndex).trigger("change");
  }

  $("#mxModal").modal("show");
}

// SHOW CABINET MODAL
function showCbMD(id, code) {
  if (id == "") {
    cbLC = JSON.parse(localStorage.getItem("cabinetCol"));
    const cabinet = cbLC.find((c) => c.code == code);
    $("#cabinetMD .id").val(cabinet.id);
    $("#cabinetMD .code").val(cabinet.code);
    $("#cabinetMD .name").val(cabinet.name);
    if (cabinet.type == 0) {
      $("#blockCheckbox0").prop("checked", true);
    } else {
      $("#trayCheckbox0").prop("checked", true);
    }
    $("#cabinetMD .block").val(cabinet.block);
    $("#cabinetMD .port").val(cabinet.port).trigger("change");
    $("#cabinetMD .desc").val(cabinet.description);
    $("#cabinetMD .pop").val(cabinet.pop).trigger("change");
  } else {
    const cabinet = cbDB.find((c) => c.id == id);
    $("#cabinetMD .id").val(cabinet.id);
    $("#cabinetMD .code").val(cabinet.code);
    $("#cabinetMD .name").val(cabinet.name);
    if (cabinet.note == "0") {
      $("#blockCheckbox0").prop("checked", true);
    } else {
      $("#trayCheckbox0").prop("checked", true);
    }
    $("#cabinetMD .block").val(cabinet.blockTray.length);
    $("#cabinetMD .port").val(cabinet.blockTray[0].totalPort).trigger("change");
    $("#cabinetMD .desc").val(cabinet.description);
    $("#cabinetMD .pop").val(cabinet.idTbPop).trigger("change");
  }
  $("#cabinetMD").modal("show");
}
// SHOW CABINET LEVEL 1 MODAL
function showCb1MD(id, code) {
  if (id == "") {
    cfLC = JSON.parse(localStorage.getItem("cabinetLv1Col"));
    const cabinet = cfLC.find((c) => c.code == code);
    $("#cabinet1MD .id").val(cabinet.id);
    $("#cabinet1MD .code").val(cabinet.code);
    $("#cabinet1MD .name").val(cabinet.name);
    if (cabinet.type == 0) {
      $("#blockCheckbox1").prop("checked", true);
    } else {
      $("#trayCheckbox1").prop("checked", true);
    }
    $("#cabinet1MD .block").val(cabinet.block);
    $("#cabinet1MD .port").val(cabinet.port).trigger("change");
    $("#cabinet1MD .desc").val(cabinet.description);
    $("#cabinet1MD .pop").val(cabinet.pop).trigger("change");
  } else {
    const cabinet = cbDB.find((c) => c.id == id);
    $("#cabinet1MD .id").val(cabinet.id);
    $("#cabinet1MD .code").val(cabinet.code);
    $("#cabinet1MD .name").val(cabinet.name);
    if (cabinet.note == "0") {
      $("#blockCheckbox1").prop("checked", true);
    } else {
      $("#trayCheckbox1").prop("checked", true);
    }
    $("#cabinet1MD .block").val(cabinet.blockTray.length);
    $("#cabinet1MD .port")
      .val(cabinet.blockTray[0].totalPort)
      .trigger("change");
    $("#cabinet1MD .desc").val(cabinet.description);
    $("#cabinet1MD .pop").val(cabinet.idTbPop).trigger("change");
  }
  $("#cabinet1MD").modal("show");
}
// SHOW CABINET LEVEL 2 MODAL
function showCb2MD(id, code) {
  if (id == "") {
    csLC = JSON.parse(localStorage.getItem("cabinetLv2Col"));
    const cabinet = csLC.find((c) => c.code == code);
    $("#cabinet2MD .id").val(cabinet.id);
    $("#cabinet2MD .code").val(cabinet.code);
    $("#cabinet2MD .name").val(cabinet.name);
    if (cabinet.type == 0) {
      $("#blockCheckbox2").prop("checked", true);
    } else {
      $("#trayCheckbox2").prop("checked", true);
    }
    $("#cabinet2MD .block").val(cabinet.block);
    $("#cabinet2MD .port").val(cabinet.port).trigger("change");
    $("#cabinet2MD .desc").val(cabinet.description);
    $("#cabinet2MD .pop").val(cabinet.pop).trigger("change");
  } else {
    const cabinet = cbDB.find((c) => c.id == id);
    $("#cabinet2MD .id").val(cabinet.id);
    $("#cabinet2MD .code").val(cabinet.code);
    $("#cabinet2MD .name").val(cabinet.name);
    if (cabinet.note == "0") {
      $("#blockCheckbox1").prop("checked", true);
    } else {
      $("#trayCheckbox1").prop("checked", true);
    }
    $("#cabinet2MD .block").val(cabinet.blockTray.length);
    $("#cabinet2MD .port")
      .val(cabinet.blockTray[0].totalPort)
      .trigger("change");
    $("#cabinet2MD .desc").val(cabinet.description);
    $("#cabinet2MD .pop").val(cabinet.idTbPop).trigger("change");
  }
  $("#cabinet2MD").modal("show");
}
// SHOW DETAIL CABINET DETAIL
function cabinetDetail(id) {
  window.open(`${MAINURL}/device-management/managed-cabinets/?cabinetId=${id}`);
}
// SHOW DETAIL CABINET LV1 DETAIL
function cabinetDetailLv1(id) {
  window.open(
    `${MAINURL}/device-management/managed-cabinets-lv1/?cabinetId=${id}`
  );
}
// SHOW DETAIL CABINET LV2 DETAIL
function cabinetDetailLv2(id) {
  window.open(
    `${MAINURL}/device-management/managed-cabinets-lv2/?cabinetId=${id}`
  );
}

//////////////////////////////////////////////////////

$(document).ready(function () {
  // SUBMIT CABLE
  $("#cableMD").submit(function (event) {
    event.preventDefault();
    const formData = $("form#cableMD").serializeArray();
    var id = getValue(formData, "id");
    var code = getValue(formData, "code");
    var name = getValue(formData, "name");
    var connection = getValue(formData, "connection");
    var capacity = getValue(formData, "capacity");
    var length = getValue(formData, "length");
    var reference = getValue(formData, "reference");
    var date = getValue(formData, "date");
    var type = getValue(formData, "type");
    var attribute = formData.filter((d) => d.name == "attribute");
    var pop = getValue(formData, "pop");
    var start = getValue(formData, "start");
    var end = getValue(formData, "end");
    if (id == "") {
      var data = JSON.parse(localStorage.getItem("cableCol"));
      var x = data.find((x) => x.code == code);
      x.name = name;
      x.connection = connection;
      x.capacity = parseInt(capacity);
      x["length"] = parseInt(length);
      x.reference = reference;
      x.date = date;
      x.type = parseInt(type);
      x.pop = pop != null ? parseInt(pop) : 0;
      x.start = start;
      x.end = end;
      for (let i = 0; i < attribute.length; i++) {
        const element = attribute[i];
        x.render[i].attribute = parseInt(element.value);
      }
      localStorage.setItem("cableCol", JSON.stringify(data));
    } else {
      var index = cableDB.findIndex((p) => p.id == id);
      // cableDB[index].iD_tbCableType = parseInt(type);
      cableDB[index].name = name;
      cableDB[index].connect = connection;
      cableDB[index].capacity = capacity;
      cableDB[index]["length"] = parseInt(length);
      cableDB[index].reference = reference;
      cableDB[index].completeDate = moment(date, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      cableDB[index].id_tbPOP = pop != null ? parseInt(pop) : 0;
      var tmp1 = start.split("-");
      var tmp2 = end.split("-");
      cableDB[index].idObjectBegin = parseInt(tmp1[1]);
      cableDB[index].nameObjectBegin = tmp1[0];
      cableDB[index].idObjectEnd = parseInt(tmp2[1]);
      cableDB[index].nameObjectEnd = tmp2[0];
      cableDB[index].totalCore = parseInt(capacity);
      var typeCableArray = [];
      for (let i = 0; i < attribute.length; i++) {
        const element = attribute[i];
        typeCableArray.push({ attribute: parseInt(element.value) });
      }
      cableDB[index].typeCableArray = JSON.stringify(typeCableArray);

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
    }
    cableStorage.map((o) => map.removeLayer(o.layer));
    cableLayer.clearLayers();
    getLocalData();
    drawCableLC();
    drawCableDB($("#popTB").val());

    $("#cableMD").modal("hide");

    toastSuccess("Cập nhật tuyến cáp thành công!");
  });
  // SUBMIT MX
  $("#mxModal").submit(function (event) {
    event.preventDefault();
    var data = $("form#mxModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    if (data.id == "") {
      mxLC = JSON.parse(localStorage.getItem("mxCol"));
      const mx = mxLC.find((c) => c.code == data.code);
      mx.name = data.name;
      mx["length"] = parseInt(data.length);
      mx.date = data.date;
      mx.pop = parseInt(data.pop);
      mx.cable = parseInt(data.cable);
      mx.order = parseInt(data.order);
      mx.status = parseInt(data.status);
      mx.image = $("#preview").attr("src");
      localStorage.setItem("mxCol", JSON.stringify(mxLC));
    } else {
      var index = mxDB.findIndex((p) => p.id == data.id);
      mxDB[index].idTbPop = parseInt(data.pop);
      mxDB[index].name = data.name;
      mxDB[index]["length"] = parseInt(data["length"]);
      mxDB[index].date = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD");
      mxDB[index].idTbCable = parseInt(data.cable);
      mxDB[index].rowIndex = parseInt(data.order);
      mxDB[index].status = parseInt(data.status);
      var updateMxCol = JSON.parse(localStorage.getItem("updateMxCol"));
      var check = updateMxCol.findIndex((u) => u.id == mxDB[index].id);
      if (check == -1) {
        updateMxCol.push(mxDB[index]);
      } else {
        updateMxCol.splice(check, 1);
        updateMxCol.push(mxDB[index]);
      }
      localStorage.setItem("updateMxCol", JSON.stringify(updateMxCol));
    }

    mxStorage.map((o) => map.removeLayer(o.layer));
    mxLayer.clearLayers();
    getLocalData();
    drawMXLC();
    drawMXDB($("#popTB").val());

    $("#mxModal").modal("hide");

    toastSuccess("Cập nhật MX thành công!");
  });
  // SUBMIT CABINET
  $("#cabinetMD").submit(function (event) {
    event.preventDefault();
    var data = $("form#cabinetMD")
      .serializeArray()
      .reduce(function (obj, item) {
        if (item.name in obj) {
          if (typeof obj[item.name] == "string") {
            var initialValue = obj[item.name];
            obj[item.name] = [];
            obj[item.name].push(initialValue);
            obj[item.name].push(item.value);
          } else {
            obj[item.name].push(item.value);
          }
        } else {
          obj[item.name] = item.value;
        }

        return obj;
      }, {});
    if (data.id == "") {
      cbLC = JSON.parse(localStorage.getItem("cabinetCol"));
      const cabinet = cbLC.find((c) => c.code == data.code);
      cabinet.name = data.name;
      cabinet.type = parseInt(data.type);
      cabinet.block = parseInt(data.block);
      cabinet.port = parseInt(data.port);
      cabinet.description = data.desc;
      cabinet.pop = parseInt(data.pop);
      localStorage.setItem("cabinetCol", JSON.stringify(cbLC));
    } else {
      $("#inforBody")
        .empty()
        .append(
          "Hiện tại không cho phép cập nhật. Liên hệ team dev nếu có yêu cầu khác."
        );
      $("#inforModal").modal("show");
      // var index = cbDB.findIndex((c) => c.id == data.id);
      // cbDB[index].idTbPop = parseInt(data.pop);
      // cbDB[index].name = data.name;
      // cbDB[index].totalPortIn = parseInt(data.portIn);
      // cbDB[index].totalPortOut = parseInt(data.portOut);
      // cbDB[index].description = data.desc;
      // var updateCBCol = JSON.parse(localStorage.getItem("updateCBCol"));
      // var check = updateCBCol.findIndex((u) => u.id == cbDB[index].id);
      // if (check == -1) {
      //   updateCBCol.push(cbDB[index]);
      // } else {
      //   updateCBCol.splice(check, 1);
      //   updateCBCol.push(cbDB[index]);
      // }
      // localStorage.setItem("updateCBCol", JSON.stringify(updateCBCol));
    }

    cbStorage.map((o) => map.removeLayer(o.layer));
    cbLayer.clearLayers();
    getLocalData();
    drawCbLC();
    drawCbDB($("#popTB").val());

    $("#cabinetMD").modal("hide");

    toastSuccess("Cập nhật Cabinet thành công!");
  });
  // SUBMIT CABINET LEVEL 1
  $("#cabinet1MD").submit(function (event) {
    event.preventDefault();
    var data = $("form#cabinet1MD")
      .serializeArray()
      .reduce(function (obj, item) {
        if (item.name in obj) {
          if (typeof obj[item.name] == "string") {
            var initialValue = obj[item.name];
            obj[item.name] = [];
            obj[item.name].push(initialValue);
            obj[item.name].push(item.value);
          } else {
            obj[item.name].push(item.value);
          }
        } else {
          obj[item.name] = item.value;
        }

        return obj;
      }, {});
    if (data.id == "") {
      cfLC = JSON.parse(localStorage.getItem("cabinetLv1Col"));
      const cabinet = cfLC.find((c) => c.code == data.code);
      cabinet.name = data.name;
      cabinet.type = parseInt(data.type);
      cabinet.block = parseInt(data.block);
      cabinet.port = parseInt(data.port);
      cabinet.description = data.desc;
      cabinet.pop = parseInt(data.pop);
      localStorage.setItem("cabinetLv1Col", JSON.stringify(cfLC));
    } else {
      $("#inforBody")
        .empty()
        .append(
          "Hiện tại không cho phép cập nhật. Liên hệ team dev nếu có yêu cầu khác."
        );
      $("#inforModal").modal("show");
      // var index = cbDB.findIndex((c) => c.id == data.id);
      // cbDB[index].idTbPop = parseInt(data.pop);
      // cbDB[index].name = data.name;
      // cbDB[index].totalPortIn = parseInt(data.portIn);
      // cbDB[index].totalPortOut = parseInt(data.portOut);
      // cbDB[index].description = data.desc;
      // var updateCBCol = JSON.parse(localStorage.getItem("updateCBCol"));
      // var check = updateCBCol.findIndex((u) => u.id == cbDB[index].id);
      // if (check == -1) {
      //   updateCBCol.push(cbDB[index]);
      // } else {
      //   updateCBCol.splice(check, 1);
      //   updateCBCol.push(cbDB[index]);
      // }
      // localStorage.setItem("updateCBCol", JSON.stringify(updateCBCol));
    }

    cb1Storage.map((o) => map.removeLayer(o.layer));
    cfLayer.clearLayers();
    getLocalData();
    drawCfLC();
    drawCfDB($("#popTB").val());

    $("#cabinet1MD").modal("hide");

    toastSuccess("Cập nhật Cabinet thành công!");
  });
  // SUBMIT CABINET LEVEL 2
  $("#cabinet2MD").submit(function (event) {
    event.preventDefault();
    var data = $("form#cabinet2MD")
      .serializeArray()
      .reduce(function (obj, item) {
        if (item.name in obj) {
          if (typeof obj[item.name] == "string") {
            var initialValue = obj[item.name];
            obj[item.name] = [];
            obj[item.name].push(initialValue);
            obj[item.name].push(item.value);
          } else {
            obj[item.name].push(item.value);
          }
        } else {
          obj[item.name] = item.value;
        }

        return obj;
      }, {});
    if (data.id == "") {
      csLC = JSON.parse(localStorage.getItem("cabinetLv2Col"));
      const cabinet = csLC.find((c) => c.code == data.code);
      cabinet.name = data.name;
      cabinet.type = parseInt(data.type);
      cabinet.block = parseInt(data.block);
      cabinet.port = parseInt(data.port);
      cabinet.description = data.desc;
      cabinet.pop = parseInt(data.pop);
      localStorage.setItem("cabinetLv2Col", JSON.stringify(csLC));
    } else {
      $("#inforBody")
        .empty()
        .append(
          "Hiện tại không cho phép cập nhật. Liên hệ team dev nếu có yêu cầu khác."
        );
      $("#inforModal").modal("show");
      // var index = cbDB.findIndex((c) => c.id == data.id);
      // cbDB[index].idTbPop = parseInt(data.pop);
      // cbDB[index].name = data.name;
      // cbDB[index].totalPortIn = parseInt(data.portIn);
      // cbDB[index].totalPortOut = parseInt(data.portOut);
      // cbDB[index].description = data.desc;
      // var updateCBCol = JSON.parse(localStorage.getItem("updateCBCol"));
      // var check = updateCBCol.findIndex((u) => u.id == cbDB[index].id);
      // if (check == -1) {
      //   updateCBCol.push(cbDB[index]);
      // } else {
      //   updateCBCol.splice(check, 1);
      //   updateCBCol.push(cbDB[index]);
      // }
      // localStorage.setItem("updateCBCol", JSON.stringify(updateCBCol));
    }

    cb2Storage.map((o) => map.removeLayer(o.layer));
    csLayer.clearLayers();
    getLocalData();
    drawCsLC();
    drawCsDB($("#popTB").val());

    $("#cabinet2MD").modal("hide");

    toastSuccess("Cập nhật Cabinet thành công!");
  });

  $("#popModal").submit(function (event) {
    event.preventDefault();
    const formData = $("form#popModal").serializeArray();
    console.log(formData);
    var id = formData.find((d) => d.name == "id").value;
    var code = formData.find((d) => d.name == "code").value;
    var name = formData.find((d) => d.name == "name").value;
    var desc = formData.find((d) => d.name == "desc").value;
    var province = formData.find((d) => d.name == "province").value;

    if (id == "") {
      var data = JSON.parse(localStorage.getItem("popCol"));
      var x = data.find((x) => x.code == code);
      x.name = name;
      x.description = desc;
      x.province = parseInt(province);
      localStorage.setItem("popCol", JSON.stringify(data));
    } else {
      var index = popDB.findIndex((p) => p.id == id);
      popDB[index].idTbArea = parseInt(province);
      popDB[index].name = name;
      popDB[index].description = desc;

      var updatePopCol = JSON.parse(localStorage.getItem("updatePopCol"));
      var check = updatePopCol.findIndex((u) => u.code == popDB[index].code);
      if (check == -1) {
        updatePopCol.push(popDB[index]);
      } else {
        updatePopCol.splice(check, 1);
        updatePopCol.push(popDB[index]);
      }
      localStorage.setItem("updatePopCol", JSON.stringify(updatePopCol));
    }

    myStorage.map((o) => map.removeLayer(o.layer));
    getLocalData($("#popTB").val());
    drawByMySelf();

    $("#popModal").modal("hide");

    toastSuccess("Cập nhật POP thành công!");
  });
});
