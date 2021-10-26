$(document).ready(async function () {
  const table = $("#table").DataTable({
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
        targets: 2,
        className: "columnCode",
      },
      {
        targets: -2,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></button>",
        orderable: false,
      },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        orderable: false,
      },
    ],
  });

  // ĐÁNH STT TỰ ĐỘNG
  table
    .on("order.dt search.dt", function () {
      table
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  //   Lấy danh sách POP đầu
  await ajaxGET(`${APICollection.POP}`).then((res) => {
    $("#connectTTMD .beginPOP").append("<option></option>");
    for (let i = 0; i < res.length; i++) {
      const element = res[i];
      var option = `<option value="${element.id}">${element.name}</option>`;
      $("#connectTTMD .beginPOP").append(option);
    }
  });

  var listConnect;
  var listOLT = await ajaxGET(`${APICollection.OLT}`);
  await loadConnectDetail();

  // BUTTON EVENT

  $("#addConnectButton").on("click", async (event) => {
    event.preventDefault();

    $("#connectTTMD .status").val("").trigger("change");
    $("#connectTTMD .beginPOP").val("").trigger("change");
    $("#mutiple-connect").append(COREINCONNECTMODAL);

    $("select").select2({
      theme: "bootstrap4",
    });

    $("#connectTTMD .connect").on("select2:select", async function (e) {
      const { id } = e.params.data;
      var beginODFInfo = await getODFInfo(getBeginODFId());
      console.log(beginODFInfo);
      $("#connectTTMD .beginODF")
        .find("option")
        .remove()
        .end()
        .append(
          `<option value=${beginODFInfo[0].id}>${beginODFInfo[0].name}</option>`
        );
      await process1();
    });

    $("#connectTTMD").modal("show");
  });

  // Lấy danh sách OLT, ODF
  $("#connectTTMD .beginPOP").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getCoreByPOP(id);
    await getOLTByPOP(id, ".beginOLT");
  });
  async function getOLTByPOP(id, className) {
    await ajaxGET(`${APICollection.OLTBYPOP}/${id}`).then((res) => {
      $(`#connectTTMD ${className}`)
        .find("option")
        .remove()
        .end()
        .append("<option></option>");
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        var option = `<option value="${element.id}">${element.name}</option>`;
        $(`#connectTTMD ${className}`).append(option);
      }
    });
  }

  async function getCoreByPOP(id) {
    console.log("popID: ", id);
    var listODF = await ajaxGET(`${APICollection.ODFBYPOP}/${id}`);

    $(`#connectTTMD .connect`)
      .last()
      .find("option")
      .remove()
      .end()
      .append("<option></option>");

    for (let i = 0; i < listODF.length; i++) {
      const odf = listODF[i];
      // console.log(odf);
      await ajaxGET(`${APICollection.CORESTT}/${odf.id}`).then(async (res) => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          console.log(element);
          // Chỉ lấy core chưa sử dụng
          if (element.status == 0) {
            var beginObject = element.begin[0];
            var endObject = element.end[0];
            if (beginObject.iDPop != id) {
              [beginObject, endObject] = [endObject, beginObject];
            }
            // var odfInfor = await getODFInfo(element.end[0].idObject);
            var option = `<option value="${element.id}" 
                                data-beginODF="${beginObject.idObject}" 
                                data-endODF="${endObject.idObject}" 
                                data-pop="${endObject.iDPop}">${element.displayName}</option>`;
            $(`#connectTTMD .connect`).last().append(option);
          }
        }
      });
    }
  }

  $("#table tbody").on("click", "button.detailBtn", async function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    var connect = listConnect.find((c) => c.id == id);
    console.log(connect);
    $("#connectTTDetailMD .id").val(connect.id);
    $("#connectTTDetailMD .code").val(connect.code);
    $("#connectTTDetailMD .name").val(connect.name);
    $("#connectTTDetailMD .status").val(connect.status).trigger("change");
    var odfInfo = await ajaxGET(
      `${APICollection.ODF}/${connect.begin[0].idObject}`
    );
    var popInfor = await ajaxGET(`${APICollection.POP}/${odfInfo[0].idTbPop}`);
    $("#connectTTDetailMD .beginPOP").val(popInfor.name);
    $("#connectTTDetailMD .beginODF").val(connect.begin[0].objectName);
    var oltBegin = listOLT.find((o) => o.id == connect.begin[0].idDevice);
    $("#connectTTDetailMD .beginOLT").val(
      oltBegin != undefined ? oltBegin.name : ""
    );
    $("#connectTTDetailMD .beginPort").val(connect.begin[0].portDeviceName);

    for (let i = 0; i < connect.connectDetail.length; i++) {
      const element = connect.connectDetail[i];
      // console.log(element.displayName);
      var tmp = `<div class="mb-1">
                  <input type="text" name="connect" class="form-control text-dark font-weight-bold connect" value="${element.displayName}" autocomplete="off" maxlength="10">
                </div>`;
      $("#mutiple-connect-detail").append(tmp);
    }

    var endODFInfo = await ajaxGET(
      `${APICollection.ODF}/${connect.end[0].idObject}`
    );
    var endPOPInfor = await ajaxGET(
      `${APICollection.POP}/${endODFInfo[0].idTbPop}`
    );
    $("#connectTTDetailMD .endPOP").val(endPOPInfor.name);
    $("#connectTTDetailMD .endODF").val(connect.end[0].objectName);
    var oltEnd = listOLT.find((o) => o.id == connect.end[0].idDevice);
    $("#connectTTDetailMD .endOLT").val(oltEnd != undefined ? oltEnd.name : "");
    $("#connectTTDetailMD .endPort").val(connect.end[0].portDeviceName);

    $("#connectTTDetailMD .desc").val(connect.note);

    $("#connectTTDetailMD").modal("show");
  });
  $("#table tbody").on("click", "button.deleteBtn", async function (event) {
    event.preventDefault();
    const id = $(this).parent().parent().children().first().next().text();
    $("#deleteURL").val(`${APICollection.CONNECTION}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });

  async function loadConnectDetail() {
    listConnect = await ajaxGET(`${APICollection.CONNECTIONTT}`);
    $(".totalConnection").empty().append(listConnect.length);
    table.clear().draw();
    for (let i = 0; i < listConnect.length; i++) {
      const element = listConnect[i];
      console.log(element);
      var statusIcon = createIcon(element.status);
      var oltBegin = listOLT.find((o) => o.id == element.begin[0].idDevice);
      var oltEnd = listOLT.find((o) => o.id == element.end[0].idDevice);
      table.row
        .add([
          "",
          element.id,
          element.code,
          element.name,
          oltBegin != undefined ? oltBegin.name : "",
          element.begin[0].portDeviceName,
          oltEnd != undefined ? oltEnd.name : "",
          element.end[0].portDeviceName,
          element.connectDetail.length,
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

  ///////////////////////////////////////////////////

  // SUBMIT MODAL
  $("#connectTTMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#connectTTMD")
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
          idConnectCategory: 1,
          code: generateCode("CNTT"),
          name: data.name,
          note: data.desc,
          status: parseInt(data.status),
          idPop: 0,
          begin: [
            {
              idObject: parseInt(data.beginODF),
              tableName: "ODF",
              idDevice: parseInt(data.beginOLT),
              oltport: data.beginPort,
            },
          ],
          end: [
            {
              idObject: parseInt(data.endODF),
              tableName: "ODF",
              idDevice: parseInt(data.endOLT),
              oltport: data.endPort,
            },
          ],
          connectDetail,
        },
      ];
      console.log(message);
      console.log(JSON.stringify(message));
      await ajaxPOST(`${APICollection.CONNECTION}`, message);
      loadConnectDetail();
    } else {
      var message = [];
      // console.log(message);
      // console.log(JSON.stringify(message));
      // await ajaxPUT(`${APICollection.CABLECORE}/${data.id}`, message);
      // loadConnectDetail();
    }
    $("#connectTTMD").modal("hide");
  });

  $("#deleteModal").submit(async function (event) {
    event.preventDefault();
    var data = $("form#deleteModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    await ajaxDELETE(`${data.deleteURL}/${data.deleteId}`);
    loadConnectDetail();
    $("#deleteModal").modal("hide");
  });

  // BUTTON TRIGGER
  $("#plusConnection").click(async (event) => {
    event.preventDefault();
    var checkInput = $("#connectTTMD .connect").last().val();
    if (checkInput != "" && checkInput != null) {
      $("#mutiple-connect").append(COREINCONNECTMODAL);

      $("select").select2({
        theme: "bootstrap4",
      });

      $("#connectTTMD .connect").on("select2:select", async function (e) {
        // const { id } = e.params.data;
        await process1();
      });

      var popId = getLastPOPId();
      await getCoreByPOP(popId);
    }
  });
  function getBeginODFId() {
    var id = $("#connectTTMD .connect option:selected")
      .first()
      .attr("data-beginODF");
    return id;
  }
  function getLastODFId() {
    var id = $("#connectTTMD .connect option:selected")
      .last()
      .attr("data-endODF");
    return id;
  }
  function getLastPOPId() {
    var id = $("#connectTTMD .connect option:selected").last().attr("data-pop");
    return id;
  }
  async function getODFInfo(id) {
    var result = await ajaxGET(`${APICollection.ODF}/${id}`);
    return result;
  }
  async function getPOPInfo(id) {
    var result = await ajaxGET(`${APICollection.POP}/${id}`);
    return result;
  }
  $("#minusConnection").click(async (event) => {
    event.preventDefault();
    $("#mutiple-connect").children().last().not(":first-child").remove();

    await process1();
  });

  async function process1() {
    var popId = getLastPOPId();
    var popInfo = await getPOPInfo(popId);
    $("#connectTTMD .endPOP")
      .find("option")
      .remove()
      .end()
      .append(`<option value=${popInfo.id}>${popInfo.name}</option>`);
    await getOLTByPOP(popId, ".endOLT");
    var lastODFInfo = await getODFInfo(getLastODFId());
    $("#connectTTMD .endODF")
      .find("option")
      .remove()
      .end()
      .append(
        `<option value=${lastODFInfo[0].id}>${lastODFInfo[0].name}</option>`
      );
  }
});
