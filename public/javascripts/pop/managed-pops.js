$(document).ready(async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const popId = urlParams.get("popId");

  //#region
  var listOdf;

  // POP INFORMATION
  await ajaxGET(`${APICollection.POP}/${popId}`).then(async (res) => {
    $("#information .name").empty().append(res.name);
    $("title").empty().append(res.name);
  });

  // DEFINE TABLE AND IT ATTRIBUTE
  const oltTable = $("#olt_table").DataTable({
    scrollX: true,
    scrollY: true,
    responsive: true,
    columnDefs: [
      {
        searchable: false,
        orderable: false,
        targets: 0,
        width: "3%",
      },
      {
        targets: 1,
        className: "columnId",
      },
      {
        targets: -2,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></i></button>",
        orderable: false,
      },
      {
        targets: -1,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        orderable: false,
      },
    ],
  });
  // ĐÁNH STT TỰ ĐỘNG
  oltTable
    .on("order.dt search.dt", function () {
      oltTable
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  var ticketOLT;
  loadOLTDataTable();

  $("#addOltButton").on("click", (event) => {
    event.preventDefault();

    $("#oltTmpModal").modal("show");
  });
  $("#olt_table tbody").on("click", "button.detailBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    var x = ticketOLT.find((t) => t.id == id);
    $("#oltModal .id").val(x.id);
    $("#oltModal .name").val(x.name);
    $("#oltModal .type").val(x.deviceType);
    $("#oltModal .quantity").val(x.totalPort);

    $("#oltModal").modal("show");
  });
  $("#olt_table tbody").on("click", "button.deleteBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("1");
    $("#deleteURL").val(`${APICollection.OLT}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });

  $("#oltTmpModal").submit(async function (event) {
    event.preventDefault();
    var data = $("form#oltTmpModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    // console.log(data);
    if (data.id == "") {
      var message = [
        {
          idTbPop: parseInt(popId),
          code: generateCode("OLT"),
          name: data.name,
          description: data.desc,
          note: data.owner,
          deviceType: data.type,
          pos: "",
          portName: data.portName,
          totalPort: parseInt(data.quantity),
        },
      ];
      // console.log(JSON.stringify(message));
      await ajaxPOST(APICollection.OLT, message);
      loadOLTDataTable();
    }
    $("#oltTmpModal").modal("hide");
  });

  async function loadOLTDataTable() {
    ticketOLT = await ajaxGET(`${APICollection.OLTBYPOP}/${popId}`).then(
      (res) => {
        $("#information .totalOlt").empty().append(res.length);
        return res;
      }
    );

    oltTable.clear().draw();
    for (let i = 0; i < ticketOLT.length; i++) {
      const element = ticketOLT[i];
      oltTable.row
        .add([
          "",
          element.id,
          element.name,
          element.deviceType,
          element.note,
          element.description,
        ])
        .draw();
    }
  }
  //#endregion
  /////////////////////////////////////////////////////////////

  //#region
  var odfTable = $("#odf_table").DataTable({
    scrollX: true,
    scrollY: true,
    responsive: true,
    pageLength: 100,
    columnDefs: [
      {
        searchable: false,
        orderable: false,
        targets: 0,
        width: "3%",
      },
      {
        targets: 1,
        className: "columnId",
      },
      {
        targets: -2,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-primary editBtn'><i class='fas fa-pencil-alt'></i></button>",
        orderable: false,
        width: "5%",
      },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        orderable: false,
        width: "5%",
      },
    ],
  });
  odfTable
    .on("order.dt search.dt", function () {
      odfTable
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  loadOdfTable();

  $("#addOdfButton").on("click", (event) => {
    event.preventDefault();

    $("#odfModal").modal("show");
  });
  $("#odf_table tbody").on("click", "button.editBtn", async function () {
    $("#inforBody")
      .empty()
      .append(
        "Hiện tại không cho phép cập nhật. Liên hệ team dev nếu có yêu cầu khác."
      );
    $("#inforModal").modal("show");
    var id = $(this).parent().parent().children().first().next().text();
    const odf = listOdf.find((o) => o.id == id);

    // $("#odfModal .id").val(odf.id);
    // $("#odfModal .code").val(odf.code);
    // $("#odfModal .name").val(odf.name);
    // $("#odfModal .block").val(odf.totalPort);
    // $("#odfModal .tray").val(odf.totalPort);
    // $("#odfModal .block").val(odf.totalPort);
    // $("#odfModal .desc").val(odf.description);

    // $("#odfModal").modal("show");
  });
  $("#odf_table tbody").on("click", "button.deleteBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("2");
    $("#deleteURL").val(`${APICollection.ODF}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });

  $("#odfModal").submit(async function (event) {
    event.preventDefault();
    var data = $("form#odfModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    // console.log(data);
    if (data.id == "") {
      var blockTrays = [];
      for (let i = 1; i <= data.block; i++) {
        for (let j = 1; j <= data.tray; j++) {
          blockTrays.push({
            name: `B${i}.TR${j}`,
            totalPort: data.port,
          });
        }
      }

      var message = [
        {
          idTbPop: parseInt(popId),
          code: generateCode("ODF"),
          name: data.name,
          description: data.desc,
          totalPort: data.block * data.tray * data.port,
          blockTrays,
        },
      ];

      // console.log(message);
      // console.log(JSON.stringify(message));
      await ajaxPOST(APICollection.ODF, message);
      loadOdfTable();
    } else {
      var message = [
        {
          id: parseInt(data.id),
          idTbPop: parseInt(popId),
          code: data.code,
          name: data.name,
          description: data.desc,
          totalPort: data.totalPort,
        },
      ];
      await ajaxPUT(`${APICollection.ODF}/${data.id}`, message);
      loadOdfTable();
    }
    $("#odfModal").modal("hide");
  });

  async function loadOdfTable() {
    listOdf = await ajaxGET(`${APICollection.ODF}/POP/${popId}`);
    $("#information .totalOdf").empty().append(listOdf.length);
    odfTable.clear().draw();
    // console.log(listOdf);
    for (let i = 0; i < listOdf.length; i++) {
      const element = listOdf[i];
      odfTable.row
        .add([
          "",
          element.id,
          element.name,
          element.totalPort,
          element.description,
        ])
        .draw();
    }
  }

  //#endregion

  /////////////////////////////////////////////////////////////////////////////////

  //#region
  var table3 = $("#connect").DataTable({
    scrollX: true,
    scrollY: true,
    responsive: true,
    columnDefs: [
      {
        searchable: false,
        orderable: false,
        targets: 0,
        width: "3%",
      },
      {
        targets: 1,
        className: "columnId",
      },
      {
        targets: -2,
        inforStore: null,
        className: "detail",
        defaultContent:
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></button>",
        orderable: false,
        width: "5%",
      },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        orderable: false,
        width: "5%",
      },
    ],
  });
  table3
    .on("order.dt search.dt", function () {
      table3
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  // ODFs
  await ajaxGET(`${APICollection.ODFBYPOP}/${popId}`).then((res) => {
    $("#connectTNMD .beginODF").append("<option></option>");
    for (let i = 0; i < res.length; i++) {
      const element = res[i];
      var option = `<option value="${element.id}">${element.name}</option>`;
      $("#connectTNMD .beginODF").append(option);
    }
  });
  $("#connectTNMD .beginODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getCoreByObject(id);
  });
  async function getCoreByObject(id) {
    // console.log(id);
    await ajaxGET(`${APICollection.CORESTN}/${id}`).then((res) => {
      $(`#connectTNMD .connect`)
        .last()
        .find("option")
        .remove()
        .end()
        .append("<option></option>");
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        console.log(element);
        if (element.status == 0) {
          var option = `<option value="${element.id}" data-id="${element.end[0].idObject}">${element.displayName}</option>`;
          $(`#connectTNMD .connect`).last().append(option);
        }
      }
    });
  }

  var lastObjectType;
  var listConnect;
  loadConnectDetail();

  // BUTTON
  $("#addConnectTN").on("click", async (event) => {
    event.preventDefault();

    $("#connectTNMD .status").val("").trigger("change");
    $("#connectTNMD .beginODF").val("").trigger("change");
    $("#mutiple-connect").append(COREINCONNECTMODAL);

    $("select").select2({
      theme: "bootstrap4",
    });

    $("#connectTNMD .connect").on("select2:select", async function (e) {
      // const { id } = e.params.data;
      // console.log(id);
      const id = $("#connectTNMD .connect").last().val();
      var coreInfo = await ajaxGET(`${APICollection.CABLECORE}/${id}`);
      console.log(coreInfo);
      $("#connectTNMD .beginODFPort, .beginOLT, .beginOLTPort")
        .find("option")
        .remove()
        .end();
      $("#connectTNMD .beginODFPort").append(
        `<option value=${coreInfo[0].begin[0].idPort}>${coreInfo[0].begin[0].namePort}</option>`
      );
      $("#connectTNMD .beginOLT").append(
        `<option value=${coreInfo[0].begin[0].idDevice}>${coreInfo[0].begin[0].deviceName}</option>`
      );
      $("#connectTNMD .beginOLTPort").append(
        `<option value=${coreInfo[0].begin[0].idPortDevice}>${coreInfo[0].begin[0].portDeviceName}</option>`
      );
      // $("#connectTNMD .beginOLTPort").val(coreInfo[0].begin[0].portDeviceName);
      if (coreInfo[0].end[0].tableName == "cabinet") {
        $("#connectTNMD .endCabinet")
          .find("option")
          .remove()
          .end()
          .append(
            `<option value=${coreInfo[0].end[0].idObject}>${coreInfo[0].end[0].objectName}</option>`
          );
        $("#connectTNMD .endCBPort")
          .find("option")
          .remove()
          .end()
          .append(
            `<option value=${coreInfo[0].end[0].idPort}>${
              coreInfo[0].end[0].codePort.split("-").slice(-1)[0]
            }</option>`
          );
        $("#connectTNMD .endST").find("option").remove().end();
        if (
          coreInfo[0].end[0].idDevice != null &&
          coreInfo[0].end[0].idDevice != 0
        ) {
          $("#connectTNMD .endST").append(
            `<option value=${coreInfo[0].end[0].idDevice}>${coreInfo[0].end[0].deviceName}</option>`
          );
        }
        lastObjectType = "cabinet";
      } else if (coreInfo[0].end[0].tableName == "mx") {
        $("#connectTNMD .endCabinet")
          .find("option")
          .remove()
          .end()
          .append(
            `<option value=${coreInfo[0].end[0].idObject}>${coreInfo[0].end[0].objectName}</option>`
          );
        $("#connectTNMD .endCBPort").find("option").remove().end();
        $("#connectTNMD .endST").find("option").remove().end();
        lastObjectType = "mx";
      }
    });

    $("#connectTNMD").modal("show");
  });
  $("#addSeperateConnectTN").on("click", async (event) => {
    $("#connectTNSeperateMD").modal("show");
  });

  $("#connect tbody").on("click", "button.detailBtn", async function () {
    var id = $(this).parent().parent().children().first().next().text();
    var connect = listConnect.find((c) => c.id == id);
    console.log(connect);
    $("#connectTNDetailMD .id").val(connect.id);
    $("#connectTNDetailMD .code").val(connect.code);
    $("#connectTNDetailMD .name").val(connect.name);
    $("#connectTNDetailMD .status").val(connect.status).trigger("change");
    $("#connectTNDetailMD .beginODF").val(connect.begin[0].objectName);
    $("#connectTNDetailMD .beginODFPort").val(connect.begin[0].portObjectName);
    $("#connectTNDetailMD .beginOLT").val(connect.begin[0].deviceName);
    $("#connectTNDetailMD .beginOLTPort").val(connect.begin[0].portDeviceName);

    for (let i = 0; i < connect.connectDetail.length; i++) {
      const element = connect.connectDetail[i];
      // console.log(element.displayName);
      var tmp = `<div class="mb-1">
                  <input type="text" name="connect" class="form-control text-dark font-weight-bold connect" value="${element.displayName}" autocomplete="off" maxlength="10">
                </div>`;
      $("#mutiple-connect-detail").append(tmp);
    }

    $("#connectTNDetailMD .endCabinet").val(connect.end[0].objectName);
    $("#connectTNDetailMD .endCBPort").val(
      connect.end[0].portObjectName.split("-").slice(-1)[0]
    );
    $("#connectTNDetailMD .endST").val(connect.end[0].deviceName);

    $("#connectTNDetailMD").modal("show");
  });
  $("#connect tbody").on("click", "button.deleteBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("3");
    $("#deleteURL").val(`${APICollection.CONNECTION}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });

  async function loadConnectDetail() {
    listConnect = await ajaxGET(`${APICollection.CONNECTIONTNBYPOP}/${popId}`);

    $(".totalConnection").empty().append(listConnect.length);

    table3.clear().draw();

    for (let i = 0; i < listConnect.length; i++) {
      const element = listConnect[i];
      console.log(element);
      var statusIcon = createIcon(element.status);
      var olt =
        element.begin.length > 0
          ? ticketOLT.find((o) => o.id == element.begin[0].idDevice)
          : undefined;
      table3.row
        .add([
          "",
          element.id,
          element.name,
          element.begin.length > 0 ? element.begin[0].objectName : "",
          olt != undefined ? olt.name : "",
          element.begin.length > 0 ? element.begin[0].portDeviceName : "",
          element.end.length > 0 ? element.end[0].objectName : "",
          element.end.length > 0 ? element.end[0].deviceName : "",
          "",
          element.connectDetail.length,
          element.totalCustomerConnected,
          statusIcon,
          element.note,
        ])
        .draw();
    }
  }

  function createIcon(status) {
    if (status == 0) {
      return '<span style="font-size: 16px; color: coral;"><i class="fas fa-circle"></i></span>';
    } else if (status == 1) {
      return '<span style="font-size: 16px; color: lime;"><i class="far fa-check-circle"></i></span>';
    } else if (status == 2) {
      return '<span style="font-size: 16px; color: black;"><i class="fas fa-exclamation-triangle"></i></span>';
    }
  }

  // SUBMIT
  $("#connectTNMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#connectTNMD")
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
    console.log(data);
    if (data.id == "") {
      var connectDetail = [];
      if (typeof data.connect == "string") {
        connectDetail.push({ idCore: parseInt(data.connect) });
      } else {
        for (let i = 0; i < data.connect.length; i++) {
          const element = data.connect[i];
          connectDetail.push({
            idCore: parseInt(element),
          });
        }
      }

      var message = [
        {
          idConnectCategory: 2,
          code: generateCode("CNTN"),
          name: data.name,
          note: data.desc,
          status: parseInt(data.status),
          idPop: parseInt(popId),
          begin: [
            {
              idObject: parseInt(data.beginODF),
              idPortObject: parseInt(data.beginODFPort),
              tableName: "ODF",
              idDevice: parseInt(data.beginOLT),
              idPortDevice: parseInt(data.beginOLTPort),
            },
          ],
          end: [
            {
              idObject: parseInt(data.endCabinet),
              idPortObject: parseInt(data.endCBPort),
              tableName: lastObjectType,
              idDevice: parseInt(data.endST) ? parseInt(data.endST) : 0,
              idPortDevice: data.endSTPort ? parseInt(data.endSTPort) : 0,
            },
          ],
          connectDetail,
        },
      ];
      // console.log(message);
      console.log(JSON.stringify(message));
      await ajaxPOST(`${APICollection.CONNECTION}`, message);
      loadConnectDetail();
    } else {
      var message = [{}];
      // await ajaxPUT(`${APICollection.OdfDetails}/${data.id}`, message);
      // loadConnectTN();
    }
    $("#connectTNMD").modal("hide");
  });
  $("#connectTNSeperateMD").submit(async (event) => {
    event.preventDefault();
    var data = $("form#connectTNSeperateMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    console.log(data);
    if (data.id == "") {
      var message = [
        {
          idConnectCategory: 2,
          code: generateCode("CNTN"),
          name: data.name,
          note: data.desc,
          status: parseInt(data.status),
          idPop: parseInt(popId),
        },
      ];
      console.log(message);
      console.log(JSON.stringify(message));
      await ajaxPOST(`${APICollection.CONNECTION}`, message);
      loadConnectDetail();
    } else {
      var message = [{}];
      // await ajaxPUT(`${APICollection.OdfDetails}/${data.id}`, message);
      // loadConnectTN();
    }
    $("#connectTNSeperateMD").modal("hide");
  });

  // BUTTON TRIGGER
  $("#plusConnection").click(async (event) => {
    event.preventDefault();
    var checkInput = $("#connectTNMD .connect").last().val();
    if (checkInput != "" && checkInput != null) {
      $("#mutiple-connect").append(COREINCONNECTMODAL);

      $("select").select2({
        theme: "bootstrap4",
      });

      $("#connectTNMD .connect").on("select2:select", async function (e) {
        const id = $("#connectTNMD .connect").last().val();
        var coreInfo = await ajaxGET(`${APICollection.CABLECORE}/${id}`);
        if (coreInfo[0].end[0].tableName == "cabinet") {
          $("#connectTNMD .endCabinet")
            .find("option")
            .remove()
            .end()
            .append(
              `<option value=${coreInfo[0].end[0].idObject}>${coreInfo[0].end[0].objectName}</option>`
            );
          $("#connectTNMD .endCBPort")
            .find("option")
            .remove()
            .end()
            .append(
              `<option value=${coreInfo[0].end[0].idPort}>${
                coreInfo[0].end[0].codePort.split("-").slice(-1)[0]
              }</option>`
            );
          $("#connectTNMD .endST")
            .find("option")
            .remove()
            .end()
            .append(
              `<option value=${coreInfo[0].end[0].idDevice}>${coreInfo[0].end[0].deviceName}</option>`
            );
          lastObjectType = "cabinet";
        } else if (coreInfo[0].end[0].tableName == "mx") {
          $("#connectTNMD .endCabinet")
            .find("option")
            .remove()
            .end()
            .append(
              `<option value=${coreInfo[0].end[0].idObject}>${coreInfo[0].end[0].objectName}</option>`
            );
          $("#connectTNMD .endCBPort").find("option").remove().end();
          $("#connectTNMD .endST").find("option").remove().end();
          lastObjectType = "mx";
        }
      });

      await getCoreByObject(getLastObjectId());
    }

    var count = $("#mutiple-connect").children().length;
    if (count > 1) {
      // $("#connectTNMD .beginODF").prop("disabled", true);
    }
  });
  function getLastObjectId() {
    var id = $("#connectTNMD .connect option:selected").last().attr("data-id");
    return id;
  }
  $("#minusConnection").click(async (event) => {
    event.preventDefault();
    $("#mutiple-connect").children().last().not(":first-child").remove();

    var count = $("#mutiple-connect").children().length;
    if (count < 2) {
      $("#connectTNMD .beginODF").prop("disabled", false);
    }

    const id = $("#connectTNMD .connect").last().val();
    var coreInfo = await ajaxGET(`${APICollection.CABLECORE}/${id}`);
    if (coreInfo[0].end[0].tableName == "cabinet") {
      $("#connectTNMD .endCabinet")
        .find("option")
        .remove()
        .end()
        .append(
          `<option value=${coreInfo[0].end[0].idObject}>${coreInfo[0].end[0].objectName}</option>`
        );
      $("#connectTNMD .endCBPort")
        .find("option")
        .remove()
        .end()
        .append(
          `<option value=${coreInfo[0].end[0].idPort}>${
            coreInfo[0].end[0].codePort.split("-").slice(-1)[0]
          }</option>`
        );
      $("#connectTNMD .endST")
        .find("option")
        .remove()
        .end()
        .append(
          `<option value=${coreInfo[0].end[0].idDevice}>${coreInfo[0].end[0].deviceName}</option>`
        );
      lastObjectType = "cabinet";
    } else if (coreInfo[0].end[0].tableName == "mx") {
      $("#connectTNMD .endCabinet")
        .find("option")
        .remove()
        .end()
        .append(
          `<option value=${coreInfo[0].end[0].idObject}>${coreInfo[0].end[0].objectName}</option>`
        );
      $("#connectTNMD .endCBPort").find("option").remove().end();
      $("#connectTNMD .endST").find("option").remove().end();
      lastObjectType = "mx";
    }
  });
  //#endregion
  /////////////////////////////////////////////////////////

  $("#deleteModal").submit(async function (event) {
    event.preventDefault();
    var data = $("form#deleteModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    await ajaxDELETE(`${data.deleteURL}/${data.deleteId}`);

    if (data.deleteType == 1) {
      loadOLTDataTable();
    }
    if (data.deleteType == 2) {
      loadOdfTable();
    } else if (data.deleteType == 3) {
      loadConnectDetail();
    }
    $("#deleteModal").modal("hide");
  });
});
