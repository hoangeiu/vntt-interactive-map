$(document).ready(async function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cabinetId = urlParams.get("cabinetId");

  async function getListPortOutST(id) {
    var tmp = await ajaxGET(`${APICollection.STPORTOUT}/${id}`);
    return tmp;
  }

  var cabinetDetail,
    listSplitters,
    listConnection,
    listCores,
    cabinetPorts,
    listCustomers;

  // CABINET & SPLITTERs INFORMATION
  cabinetInfor = await ajaxGET(`${APICollection.CB}/${cabinetId}`).then(
    async (res) => {
      $("title").empty().append(res[0].name);
      $("#information .name").empty().append(res[0].name);
      var summaryStatusPort = 0;
      for (let i = 0; i < res[0].blockTray.length; i++) {
        const element = res[0].blockTray[i];
        await ajaxGET(`${APICollection.CABINETPORTS}/${element.id}`).then(
          (res) => {
            res.forEach((port) => {
              if (port.status == 1) {
                summaryStatusPort++;
              }
            });
          }
        );
      }
      $("#information .port")
        .empty()
        .append(`${res[0].totalPort}/${summaryStatusPort}`);
      return res;
    }
  );

  const table2 = $("#splitter_table").DataTable({
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
      // {
      //   targets: -3,
      //   inforStore: null,
      //   className: "detail",
      //   defaultContent:
      //     "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></i></button>",
      //   orderable: false,
      //   width: "5%",
      // },
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

  loadSplitterTable();
  loadConnectDetail();

  $("#addSplitterBtn").on("click", (event) => {
    event.preventDefault();
    $("#splitterModal .splitterOut").val("").trigger("change");
    $("#splitterModal").modal("show");
  });
  // $("#splitter_table tbody").on(
  //   "click",
  //   "button.detailBtn",
  //   async function (event) {
  //     event.preventDefault();
  //     console.log("***Chức năng chưa hoàn thành");
  //   }
  // );
  $("#splitter_table tbody").on("click", "button.editBtn", async function () {
    const id = $(this).parent().parent().children().first().next().text();
    const splitter = listSplitters.find((s) => s.id == id);
    $("#splitterModal .id").val(splitter.id);
    $("#splitterModal .code").val(splitter.code);
    $("#splitterModal .name").val(splitter.name);
    $("#splitterModal .splitterIn").val(splitter.totalPortIn);
    $("#splitterModal .splitterOut")
      .val(splitter.totalPortOut)
      .trigger("change");
    $("#splitterModal .desc").val(splitter.note);
    $("#splitterModal").modal("show");
  });
  $("#splitter_table tbody").on(
    "click",
    "button.deleteBtn",
    async function (event) {
      event.preventDefault();
      const id = $(this).parent().parent().children().first().next().text();
      $("#deleteType").val("2");
      $("#deleteURL").val(`${APICollection.Splitters}`);
      $("#deleteId").val(id);
      $("#deleteModal").modal("show");
    }
  );
  $("#splitterModal").submit(async function (event) {
    event.preventDefault();
    var data = $("form#splitterModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    if (data.id == "") {
      var message = [
        {
          idTbCabinet: parseInt(cabinetId),
          code: generateCode("ST"),
          name: data.name,
          totalPortOut: parseInt(data.splitterOut),
          note: data.desc,
        },
      ];
      await ajaxPOST(`${APICollection.Splitters}`, message).then((res) => {
        loadSplitterTable();
      });
    } else {
      var message = [
        {
          op: "replace",
          path: "/note",
          value: data.desc,
        },
        {
          op: "replace",
          path: "/name",
          value: data.name,
        },
      ];
      await ajaxPATCH(`${APICollection.Splitters}/${data.id}`, message).then(
        (res) => {
          loadSplitterTable();
        }
      );
    }
    $("#splitterModal").modal("hide");
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
    loadSplitterTable();
    $("#deleteModal").modal("hide");
  });

  async function loadSplitterTable() {
    listSplitters = await ajaxGET(`${APICollection.splittersCB}/${cabinetId}`);

    table2.clear().draw();

    for (let i = 0; i < listSplitters.length; i++) {
      const e = listSplitters[i];
      var portOutUsed = await getListPortOutST(e.id).then((res) => {
        return res.filter((p) => p.status == 1);
      });
      table2.row
        .add([
          "",
          e.id,
          e.code,
          e.name,
          `1/${e.idTbPortIn == null ? 0 : 1}`,
          `${e.totalPortOut}/${portOutUsed.length}`,
          e.note,
        ])
        .draw();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const table4 = $("#connect_table").DataTable({
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
  table4
    .on("order.dt search.dt", function () {
      table4
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  $("#addConnectBtn").on("click", async (event) => {
    await getConnections(".connect");
    await getCoreByObject(
      cabinetId,
      "#connectCabinetMD .core1, #connectCabinetMD .core2"
    );
    await getSplitters(cabinetId, "#connectCabinetMD .splitter");

    $("#connectCabinetMD").modal("show");
  });
  $("#connect_table tbody").on("click", "button.editBtn", async function () {
    $("#inforBody")
      .empty()
      .append(
        "Vui lòng vào chỉnh sửa toàn tuyến kết nối trong tab kết nối ở pop. Liên hệ team dev nếu có yêu cầu khác."
      );
    $("#inforModal").modal("show");
  });
  $("#connect_table tbody").on("click", "button.deleteBtn", async function () {
    $("#inforBody")
      .empty()
      .append(
        "Vui lòng vào chỉnh sửa toàn tuyến kết nối trong tab kết nối ở pop. Liên hệ team dev nếu có yêu cầu khác."
      );
    $("#inforModal").modal("show");
  });
  // Splitter ports
  $("#connectCabinetMD .splitter").on("select2:select", async function (e) {
    const { id } = e.params.data;
    // console.log(id);
    await getSTPorts(id, "#connectCabinetMD .splitterOut", null);
  });

  $("#connectCabinetMD").submit(async (event) => {
    event.preventDefault();

    var data = $("form#connectCabinetMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    console.log(data);
    // Update end part of core1, begin part of core2
    // console.log(listCores);
    var core1 = listCores.find((core) => core.id == data.core1);
    console.log(core1);
    var core2 = listCores.find((core) => core.id == data.core2);
    console.log(core2);
    // Update connect
    var connection = listConnection.find((c) => c.id == data.connect);
    console.log(connection);

    if (core1.idTbCable != core2.idTbCable) {
      // UPDATE connect begin
      if (core1.begin[0].tableName == "odf") {
        connection.begin.push({
          idObject: parseInt(core1.begin[0].idObject),
          idPortObject: parseInt(core1.begin[0].idPort),
          tableName: "ODF",
          idDevice: parseInt(core1.begin[0].idDevice),
          oltport: parseInt(core1.begin[0].idPortDevice),
        });
      }

      // UPDATE connect end
      connection.end.push({
        idObject: parseInt(core2.end[0].idObject),
        idPortObject: parseInt(core2.end[0].idPort),
        tableName: "cabinet",
        idDevice: parseInt(core2.end[0].idDevice),
        idPortDevice: parseInt(core2.end[0].idPortDevice),
      });

      // Check connectDetail contain core or not
      if (
        !connection.connectDetail.find(
          (core) => core.idCore == parseInt(data.core1)
        )
      ) {
        connection.connectDetail.push({ idCore: parseInt(data.core1) });
      }
      if (
        !connection.connectDetail.find(
          (core) => core.idCore == parseInt(data.core2)
        )
      ) {
        connection.connectDetail.push({ idCore: parseInt(data.core2) });
      }

      console.log(connection);
      console.log(JSON.stringify([connection]));
      await ajaxPUT(`${APICollection.CONNECTION}/${connection.id}`, [
        connection,
      ]);
      // #Update connect

      loadConnectDetail();
    } else {
      $("#inforBody")
        .empty()
        .append(
          "Không thể cho 2 core cùng tuyến kết nối. Liên hệ team dev nếu có yêu cầu khác."
        );
      $("#inforModal").modal("show");
    }
    $("#connectCabinetMD").modal("hide");
  });

  async function loadConnectDetail() {
    cabinetDetail = await ajaxGET(`${APICollection.CB}/${cabinetId}`);
    console.log(cabinetDetail);
    $("#information .totalConnection")
      .empty()
      .append(`${cabinetDetail[0].connect.length}`);

    table4.clear().draw();

    for (let i = 0; i < cabinetDetail[0].connect.length; i++) {
      const connect = cabinetDetail[0].connect[i];
      table4.row
        .add([
          "",
          connect.id,
          connect.code,
          connect.name,
          connect.connectDetail.length > 0
            ? connect.connectDetail[0].sortName
            : "",
          connect.connectDetail.length > 1
            ? connect.connectDetail[1].sortName
            : "",
          "",
        ])
        .draw();
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////
  const table3 = $("#customer_table").DataTable({
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
        targets: 8,
        render: function (data, type, row) {
          return type === "display" && data.length > 10
            ? data.substr(0, 10) + "…"
            : data;
        },
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

  $("#radio1").change(function () {
    $("#jump .cabinetPort").prop("disabled", false);
    $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
      "disabled",
      true
    );
  });
  $("#radio2").change(function () {
    $("#jump .cabinetPort").prop("disabled", true);
    $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
      "disabled",
      false
    );
  });

  $("#addCustomerConnectBtn").on("click", async (event) => {
    event.preventDefault();

    await getCoreByObject(cabinetId, "#customerModal .core");
    await getSplitters(cabinetId, "#customerModal .splitter");
    await getCabinetPorts(cabinetId, ".cabinetPort", null);

    $("#radio1").prop("checked", true);
    $("#jump .cabinetPort").prop("disabled", false);
    $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
      "disabled",
      true
    );

    $("#customerModal").modal("show");
  });

  // SPLITTER PORTS
  $("#customerModal .core").on("select2:select", async function (e) {
    const { id } = e.params.data;
    var core = listCores.find((c) => c.id == id);
    var portName = core.end[0].namePort.split("-");
    $(".cabinetPortIn")
      .find("option")
      .remove()
      .end()
      .append(`<option value="${core.end[0].idPort}">${portName[1]}</option>`);
    // console.log(core);
    if (core.end[0].idDevice == 0) {
      $("#radio1").prop("checked", true);
      $("#radio2").prop("checked", false);
      // Duplicate code
      $("#jump .cabinetPort").prop("disabled", false);
      $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
        "disabled",
        true
      );
    } else {
      $("#radio1").prop("checked", false);
      $("#radio2").prop("checked", true);
      // Duplicate code
      $("#jump .cabinetPort").prop("disabled", true);
      $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
        "disabled",
        false
      );
      $(".splitter").val(core.end[0].idDevice).trigger("change");
      await getSTPorts(
        core.end[0].idDevice,
        "#customerModal .splitterOut",
        null
      );
    }
  });

  // SPLITTER PORTS
  $("#customerModal .splitter").on("select2:select", async function (e) {
    const { id } = e.params.data;
    // console.log(id);
    await getSTPorts(id, "#customerModal .splitterOut", null);
  });

  $("#search-customer").click(async (event) => {
    event.preventDefault();
    var param = $("#param").val();
    showLoading();
    await getCustomers(param);
    hideLoading();
  });

  $("#customer_table tbody").on("click", "button.editBtn", async function () {
    const id = $(this).parent().parent().children().first().next().text();
    const customer = listCustomers.find((s) => s.id == id);
    console.log(customer);

    await getCoreByObject(cabinetId, "#customerModal .core");
    await getSplitters(cabinetId, "#customerModal .splitter");
    await getCabinetPorts(cabinetId, ".cabinetPort", customer.cabinetPortIdOut);

    $("#customerModal .id").val(customer.id);
    $("#customerModal .code").val(customer.customerCode);
    $("#customerModal .core").val(customer.coreId).trigger("change");
    $("#customerModal .cabinetPortIn").append(
      `<option value=${customer.cabinetPortIdIn}>${
        customer.cabinetPortInName.split("-")[1]
      }</option>`
    );
    $("#customerModal .cabinetPort")
      .val(customer.cabinetPortIdOut)
      .trigger("change");
    $("#customerModal .customer").append(
      `<option value=${customer.id}>${customer.customerName}</option>`
    );
    if (!customer.splitterName) {
      $("#radio1").prop("checked", true);
      $("#radio2").prop("checked", false);
      // Duplicate code
      $("#jump .cabinetPort").prop("disabled", false);
      $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
        "disabled",
        true
      );
    } else {
      $("#radio1").prop("checked", false);
      $("#radio2").prop("checked", true);
      // Duplicate code
      $("#jump .cabinetPort").prop("disabled", true);
      $("#over .splitter, #over .splitterOut, #over .cabinetPort").prop(
        "disabled",
        false
      );
      $("#customerModal .splitter").val(customer.splitterId).trigger("change");

      await getSTPorts(
        customer.splitterId,
        "#customerModal .splitterOut",
        customer.splitterPortId
      );
      $("#customerModal .splitterOut")
        .val(customer.splitterPortId)
        .trigger("change");
    }

    $("#customerModal").modal("show");
  });

  $("#customerModal").submit(async (event) => {
    event.preventDefault();
    var data = $("form#customerModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    // console.log(data);
    if (data.optradio == "option1") {
      if (data.cabinetPortIn == data.cabinetPortOut) return;
      var message = {
        id: parseInt(data.customer),
        cabinetId: parseInt(cabinetId),
        splitterPortId: 0,
        cabinetPortIdIn: parseInt(data.cabinetPortIn),
        cabinetPortIdOut: parseInt(data.cabinetPortOut),
        coreId: parseInt(data.core),
        Type: 0,
      };

      // console.log(JSON.stringify(message));
      await ajaxPUT(`${APICollection.CUSTOMER}/${data.customer}`, message);
    } else {
      if (data.cabinetPortIn == data.cabinetPortOut) return;
      var message = {
        id: parseInt(data.customer),
        cabinetId: parseInt(cabinetId),
        splitterPortId: parseInt(data.splitterOut),
        cabinetPortIdIn: parseInt(data.cabinetPortIn),
        cabinetPortIdOut: parseInt(data.cabinetPortOut),
        coreId: parseInt(data.core),
        Type: 1,
      };

      // console.log(JSON.stringify(message));
      await ajaxPUT(`${APICollection.CUSTOMER}/${data.customer}`, message);
    }
    loadCustomerDetail();
    $("#customerModal").modal("hide");
  });

  loadCustomerDetail();
  async function loadCustomerDetail() {
    listCustomers = await ajaxGET(
      `${APICollection.CUSTOMERBYCB}/${cabinetId}`
    ).then((res) => {
      table3.clear().draw();

      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        table3.row
          .add([
            "",
            element.id,
            element.customerCode,
            element.cabinetPortInName.split("-")[1],
            element.splitterName ? element.splitterName : "",
            element.splitterPortName ? element.splitterPortName : "",
            element.cabinetPortOutName.split("-")[1],
            element.customerName,
            element.address,
          ])
          .draw();
      }

      return res;
    });
  }
  ///////////////////////////////////////////////////////////////////
  // FUNCTION

  async function getCabinetPorts(id, className, idPortUsed) {
    $(`#customerModal ${className}`).find("option").remove().end();

    cabinetPorts = await ajaxGET(`${APICollection.CB}/${id}`).then(
      async (res) => {
        for (let i = 0; i < res[0].blockTray.length; i++) {
          const element = res[0].blockTray[i];
          await ajaxGET(`${APICollection.CABINETPORTS}/${element.id}`).then(
            (res) => {
              $(`#customerModal ${className}`).append(
                '<option value="0"></option>'
              );
              for (let i = 0; i < res.length; i++) {
                const port = res[i];

                if (port.status == 0 || port.id == idPortUsed) {
                  var name = port.name.split("-");
                  var option = `<option value="${port.id}">${
                    name[name.length - 1]
                  }</option>`;
                  $(`#customerModal ${className}`).append(option);
                }
              }
              return res;
            }
          );
        }
      }
    );
  }

  async function getSplitters(id, className) {
    var result = await ajaxGET(`${APICollection.splittersCB}/${id}`).then(
      (res) => {
        // console.log(res);
        $(`${className}`).find("option").remove().end();
        $(`${className}`).append('<option value="0"></option>');
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          var option = `<option value="${element.id}">${element.name}</option>`;
          $(`${className}`).append(option);
        }
        return res;
      }
    );
    return result;
  }

  async function getSTPorts(id, className, idPortUsed) {
    $(`${className}`)
      .find("option")
      .remove()
      .end()
      .append('<option value="0"></option>');
    if (id != 0) {
      await ajaxGET(`${APICollection.STPORTOUT}/${id}`).then((res) => {
        for (let i = 0; i < res.length; i++) {
          const port = res[i];
          if (port.status == 0 || port.id == idPortUsed) {
            var option = `<option value="${port.id}">${port.name}</option>`;
            $(`${className}`).append(option);
          }
        }
      });
    }
  }

  async function getConnections(className) {
    listConnection = await ajaxGET(
      `${APICollection.CONNECTIONTNBYPOP}/${cabinetDetail[0].idTbPop}`
    ).then((res) => {
      $(`#connectCabinetMD ${className}`).append("<option></option>");
      for (let i = 0; i < res.length; i++) {
        const connect = res[i];
        console.log(connect);

        var option = `<option value="${connect.id}">${connect.name}</option>`;
        $(`#connectCabinetMD ${className}`).append(option);
      }
      return res;
    });
  }

  async function getCoreByObject(id, className) {
    listCores = await ajaxGET(`${APICollection.CORESTN}/${id}`).then((res) => {
      $(`${className}`).append("<option></option>");
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        // console.log(element);
        // if (element.status == 0) {
        var option = `<option value="${element.id}" data-id="${element.end[0].idObject}">${element.displayName}</option>`;
        $(`${className}`).append(option);
        // }
      }

      return res;
    });
  }

  async function getCustomers(param) {
    await ajaxGET(`${APICollection.SEARCHCUSTOMER}/${param}`).then((res) => {
      $(".customer").find("option").remove().end();
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        var option = `<option value="${element.id}">${element.customerName} - ${element.address}</option>`;
        $(".customer").append(option);
      }
    });
  }
});
