$(document).ready(async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cableId = urlParams.get("cableId");

  const table1 = $("#core_table").DataTable({
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
        targets: 2,
        className: "columnCode",
      },
      {
        targets: -2,
        inforStore: null,
        className: "edit",
        defaultContent:
          "<button class='btn btn-primary editBtn'><i class='fas fa-pencil-alt'></i></button>",
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
  table1
    .on("order.dt search.dt", function () {
      table1
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  // Lấy thông tin của cable
  var cableDetail = await ajaxGET(`${APICollection.Cable}/${cableId}`).then(
    (res) => {
      const e = res[0];
      $("title").empty().append(e.name);
      $(".name").empty().append(e.name);
      $(".start")
        .empty()
        .append(e.begin.length > 0 ? e.begin[0].name : "unknown");
      $(".end")
        .empty()
        .append(e.end.length > 0 ? e.end[0].name : "unknown");
      $(".length").empty().append(e["length"]);
      $(".core").empty().append(`${e.totalCore}/0`);
      return res;
    }
  );
  // console.log(cableDetail);

  var listCore;
  loadCableDetail();

  // BUTTON EVENT

  $("#addCoreButton").on("click", async (event) => {
    event.preventDefault();
    showLoading();
    await getODF(cableDetail[0].begin[0].id, "#coreTTMD .beginODF");
    await getODF(cableDetail[0].end[0].id, "#coreTTMD .endODF");
    hideLoading();
    $("#coreTTMD").modal("show");
  });

  $("#addCoresButton").on("click", async (event) => {
    event.preventDefault();
    showLoading();
    await getODF(cableDetail[0].begin[0].id, "#coresTTMD .beginODF");
    await getODF(cableDetail[0].end[0].id, "#coresTTMD .endODF");
    hideLoading();
    $("#coresTTMD").modal("show");
  });

  $("#coreTTMD .beginODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getODFPorts(id, "#coreTTMD .beginPort", null);
  });
  $("#coresTTMD .beginODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getODFPorts(id, "#coresTTMD .beginPort", null);
  });

  $("#coreTTMD .endODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getODFPorts(id, "#coreTTMD .endPort", null);
  });
  $("#coresTTMD .endODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getODFPorts(id, "#coresTTMD .endPort", null);
  });

  $("#core_table tbody").on("click", "button.editBtn", async function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    var core = listCore.find((core) => core.id == id);
    showLoading();
    $("#coreTTMD .id").val(core.id);
    $("#coreTTMD .core").val(core.code);
    $("#coreTTMD .name").val(core.name);

    await getODF(cableDetail[0].begin[0].id, "#coreTTMD .beginODF");
    $("#coreTTMD .beginODF").val(core.begin[0].idObject).trigger("change");
    await getODFPorts(
      core.begin[0].idObject,
      "#coreTTMD .beginPort",
      core.begin[0].idPort
    );
    $("#coreTTMD .beginPort").val(core.begin[0].idPort).trigger("change");

    await getODF(cableDetail[0].end[0].id, "#coreTTMD .endODF");
    $("#coreTTMD .endODF").val(core.end[0].idObject).trigger("change");
    await getODFPorts(
      core.end[0].idObject,
      "#coreTTMD .endPort",
      core.end[0].idPort
    );
    $("#coreTTMD .endPort").val(core.end[0].idPort).trigger("change");

    if (core.status == 2) {
      $("#errorCheckbox").prop("checked", true);
    }
    $("#coreTTMD .desc").val(core.note);
    hideLoading();
    $("#coreTTMD").modal("show");
  });

  $("#core_table tbody").on(
    "click",
    "button.deleteBtn",
    async function (event) {
      event.preventDefault();
      const id = $(this).parent().parent().children().first().next().text();
      $("#deleteType").val("1");
      $("#deleteURL").val(`${APICollection.CABLECORE}`);
      $("#deleteId").val(id);
      $("#deleteModal").modal("show");
    }
  );

  async function loadCableDetail() {
    listCore = await ajaxGET(`${APICollection.CABLECORES}/${cableId}`);
    $(".core").empty().append(`${cableDetail[0].totalCore}/${listCore.length}`);

    table1.clear().draw();

    for (let i = 0; i < listCore.length; i++) {
      const core = listCore[i];
      // console.log(core);
      var statusIcon = "";
      if (core.status == 0) {
        statusIcon =
          '<span style="font-size: 16px; color: coral;"><i class="fas fa-circle"></i></span>';
      } else if (core.status == 1) {
        statusIcon =
          '<span style="font-size: 16px; color: lime;"><i class="far fa-check-circle"></i></span>';
      } else if (core.status == 2) {
        statusIcon =
          '<span style="font-size: 16px; color: black;"><i class="fas fa-exclamation-triangle"></i></span>';
      }

      table1.row
        .add([
          "",
          core.id,
          core.code,
          core.name,
          core.begin.length > 0 ? core.begin[0].objectName : "",
          core.begin.length > 0 ? core.begin[0].codePort : "",
          core.end.length > 0 ? core.end[0].objectName : "",
          core.end.length > 0 ? core.end[0].codePort : "",
          statusIcon,
          core.purpose,
          core.note,
        ])
        .draw();
    }
  }

  // SUBMIT MODAL
  $("#coreTTMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#coreTTMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    console.log(data);
    // console.log("error: ", data.error ? 1 : 0);
    if (data.id == "") {
      var message = [
        {
          idTbCable: parseInt(cableId),
          code: generateCode("CO"),
          name: data.name,
          note: data.desc,
          status: data.error ? 2 : 0,
          begin: [
            {
              idObject: parseInt(data.beginODF),
              tableName: "odf",
              idPort: parseInt(data.beginPort),
            },
          ],
          end: [
            {
              idObject: parseInt(data.endODF),
              tableName: "odf",
              idPort: parseInt(data.endPort),
            },
          ],
        },
      ];
      // console.log(message);
      console.log(JSON.stringify(message));
      await ajaxPOST(`${APICollection.CABLECORE}`, message);
      loadCableDetail();
    } else {
      var message = [
        {
          id: parseInt(data.id),
          idTbCable: parseInt(cableId),
          code: data.code,
          name: data.name,
          note: data.desc,
          purpose: "",
          status: data.error ? 2 : 0,
          begin: [
            {
              idObject: parseInt(data.beginODF),
              tableName: "odf",
              idPort: parseInt(data.beginPort),
            },
          ],
          end: [
            {
              idObject: parseInt(data.endODF),
              tableName: "odf",
              idPort: parseInt(data.endPort),
            },
          ],
        },
      ];
      // console.log(message);
      // console.log(JSON.stringify(message));
      await ajaxPUT(`${APICollection.CABLECORE}/${data.id}`, message);
      loadCableDetail();
    }
    $("#coreTTMD").modal("hide");
  });

  $("#coresTTMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#coresTTMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    console.log(data);

    var ODFBeginPorts = await ajaxGET(
      `${APICollection.ODFPORTS2}/${data.beginODF}`
    ).then((res) => {
      return res.filter((p) => p.status == 0);
    });
    var ODFBeginPortIndex = ODFBeginPorts.findIndex(
      (p) => p.id == data.beginPort
    );
    var checkODFBeginEnoughPort =
      ODFBeginPorts.length - ODFBeginPortIndex >= data.core;

    var ODFEndPorts = await ajaxGET(
      `${APICollection.ODFPORTS2}/${data.endODF}`
    ).then((res) => {
      return res.filter((p) => p.status == 0);
    });
    var ODFEndPortIndex = ODFEndPorts.findIndex((p) => p.id == data.endPort);
    var checkODFEndEnoughPort =
      ODFEndPorts.length - ODFEndPortIndex >= data.core;
    var createCores = [];

    if (checkODFBeginEnoughPort && checkODFEndEnoughPort) {
      for (let i = 0; i < data.core; i++) {
        var message = {
          idTbCable: parseInt(cableId),
          code: generateCode("CO"),
          name: `${data.prefix} ${parseInt(data.startNumber) + i}`,
          note: "",
          status: 0,
          begin: [
            {
              idObject: parseInt(data.beginODF),
              tableName: "odf",
              idPort: parseInt(ODFBeginPorts[i + ODFBeginPortIndex].id),
            },
          ],
          end: [
            {
              idObject: parseInt(data.endODF),
              tableName: "odf",
              idPort: parseInt(ODFEndPorts[i + ODFEndPortIndex].id),
            },
          ],
        };
        createCores.push(message);
      }
      console.log(createCores);
      console.log(JSON.stringify(createCores));
      await ajaxPOST(`${APICollection.CABLECORE}`, createCores);
      loadCableDetail();
      $("#coresTTMD").modal("hide");
    } else {
      $("#coresTNMD").modal("hide");
      $("#inforBody")
        .empty()
        .append("Không đủ số lượng port trống để tạo core.");
      $("#inforModal").modal("show");
    }

    $("#coresTTMD").modal("hide");
  });

  ///////////////////////////////////////////////////

  const table2 = $("#mx_table").DataTable({
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
  table2
    .on("order.dt search.dt", function () {
      table2
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();
  var listPop = await ajaxGET(`${APICollection.POP}`);
  loadMXTN();

  async function loadMXTN() {
    var listMX = await ajaxGET(`${APICollection.MXBYCABLE}/${cableId}`).then(
      (res) => {
        return res;
      }
    );

    table2.clear().draw();

    $(".mx").empty().append(`${listMX.length}`);

    for (let i = 0; i < listMX.length; i++) {
      const element = listMX[i];

      var pop = listPop.find((p) => p.id == element.idTbPop);

      table2.row
        .add([
          "",
          element.id,
          element.code,
          element.name,
          element.rowIndex,
          element.length,
          element.date,
          pop != undefined ? pop.name : "",
        ])
        .draw();
    }
  }

  $("#mx_table tbody").on("click", "button.deleteBtn", async function (event) {
    event.preventDefault();
    const id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("2");
    $("#deleteURL").val(`${APICollection.MX}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });

  /////////////////////////////////////////////////
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
      loadCableDetail();
    }
    if (data.deleteType == 2) {
      console.log("2222");
      loadMXTN();
    }

    $("#deleteModal").modal("hide");
  });

  async function getODFPorts(odfId, className, idPortUsed) {
    $(`${className}`)
      .find("option")
      .remove()
      .end()
      .append('<option value="0"></option>');
    var ports = [];
    await ajaxGET(`${APICollection.ODF}/${odfId}`).then(async (res) => {
      for (let i = 0; i < res[0].blockTrays.length; i++) {
        const blockTray = res[0].blockTrays[i];
        await ajaxGET(`${APICollection.ODFPORTS}/${blockTray.id}`).then(
          (res) => {
            for (let j = 0; j < res.length; j++) {
              const port = res[j];
              if (port.status == 0 || port.id == idPortUsed) {
                var option = `<option value="${port.id}">${port.name}</option>`;
                $(`${className}`).append(option);
                ports.push(port);
              }
            }
          }
        );
      }
    });
    return ports;
  }

  async function getODF(popId, className) {
    await ajaxGET(`${APICollection.ODFBYPOP}/${popId}`).then((res) => {
      $(`${className}`)
        .find("option")
        .remove()
        .end()
        .append('<option value="0"></option>');
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        var option = `<option value="${element.id}">${element.name}</option>`;
        $(`${className}`).append(option);
      }
    });
  }
});
