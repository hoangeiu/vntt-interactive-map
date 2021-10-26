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

      return res;
    }
  );
  console.log(cableDetail);

  // Check begin device
  var listSTBegin, listCore;

  if (cableDetail[0].nameObjectBegin == "cabinet") {
    $("#coreTNMD .ODF").prop("disabled", true).parent().hide();
    $("#coresTNMD .ODF").prop("disabled", true).parent().hide();
  }

  loadCableDetail();

  // BUTTON EVENT

  $("#addCoreButton").on("click", async (event) => {
    event.preventDefault();

    if (cableDetail[0].nameObjectBegin == "pop") {
      const popId = cableDetail[0].begin[0].id;
      await getODF(popId, "#coreTNMD .ODF");
      await getOLT(popId, "#coreTNMD .beginDevice");
    } else if (cableDetail[0].nameObjectBegin == "cabinet") {
      await getCabinetPorts(
        cableDetail[0].begin[0].id,
        "#coreTNMD .beginPort",
        null
      );
      await getSplitters(cableDetail[0].begin[0].id, ".beginDevice");
    }

    await getCabinetPorts(cableDetail[0].end[0].id, "#coreTNMD .endPort", null);
    await getSplitters(cableDetail[0].end[0].id, ".endDevice");

    $("#coreTNMD").modal("show");
  });
  $("#addCoresButton").on("click", async (event) => {
    event.preventDefault();

    if (cableDetail[0].nameObjectBegin == "pop") {
      const popId = cableDetail[0].begin[0].id;
      await getODF(popId, "#coresTNMD .ODF");
    } else if (cableDetail[0].nameObjectBegin == "cabinet") {
      await getCabinetPorts(
        cableDetail[0].begin[0].id,
        "#coresTNMD .beginPort",
        null
      );
    }

    await getCabinetPorts(
      cableDetail[0].end[0].id,
      "#coresTNMD .endPort",
      null
    );

    $("#coresTNMD").modal("show");
  });

  // EVENT
  // ODF ports
  $("#coreTNMD .ODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getODFPorts(id, "#coreTNMD .beginPort", null);
  });

  $("#coresTNMD .ODF").on("select2:select", async function (e) {
    const { id } = e.params.data;
    await getODFPorts(id, "#coresTNMD .beginPort", null);
  });

  // Splitter ports
  $("#coreTNMD .beginDevice").on("select2:select", async function (e) {
    const { id } = e.params.data;
    // console.log(id);
    if (cableDetail[0].nameObjectBegin == "pop") {
      await getOLTPorts(id, "select.beginDevicePort", null);
    } else if (cableDetail[0].nameObjectBegin == "cabinet") {
      await getSTPorts(id, "select.beginDevicePort", null);
    }
  });

  // #EVENT

  // BUTTON
  $("#core_table tbody").on("click", "button.editBtn", async function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    var core = listCore.find((c) => c.id == id);
    console.log(core);

    if (
      cableDetail[0].nameObjectBegin == "pop" &&
      cableDetail[0].nameObjectEnd == "cabinet"
    ) {
      $("#coreTNMD .id").val(core.id);
      $("#coreTNMD .code").val(core.code);
      $("#coreTNMD .name").val(core.name);
      $("#coreTNMD .status").val(core.status).trigger("change");

      await getODF(core.begin[0].iDPop, ".ODF");

      $("#coreTNMD .ODF").val(core.begin[0].idObject).trigger("change");

      await getODFPorts(
        core.begin[0].idObject,
        "#coreTNMD .beginPort",
        core.begin[0].idPort
      );
      $("#coreTNMD .beginPort").val(core.begin[0].idPort).trigger("change");

      await getCabinetPorts(
        core.end[0].idObject,
        "#coreTNMD .endPort",
        core.end[0].idPort
      );
      $("#coreTNMD .endPort").val(core.end[0].idPort).trigger("change");

      await getOLT(core.begin[0].iDPop, ".beginDevice");

      $("#coreTNMD .beginDevice").val(core.begin[0].idDevice).trigger("change");

      await getOLTPorts(
        core.begin[0].idDevice,
        "select.beginDevicePort",
        core.begin[0].idPortDevice
      );

      $("#coreTNMD .beginDevicePort")
        .val(core.begin[0].idPortDevice)
        .trigger("change");

      $("#coreTNMD .endDevice").val(core.end[0].idDevice).trigger("change");
      $("#coreTNMD .desc").val(core.note);
    } else if (
      cableDetail[0].nameObjectBegin == "cabinet" &&
      cableDetail[0].nameObjectEnd == "cabinet"
    ) {
      $("#coreTNMD .id").val(core.id);
      $("#coreTNMD .code").val(core.code);
      $("#coreTNMD .name").val(core.name);
      $("#coreTNMD .status").val(core.status).trigger("change");

      await getCabinetPorts(
        core.begin[0].idObject,
        "#coreTNMD .beginPort",
        core.begin[0].idPort
      );
      $("#coreTNMD .beginPort").val(core.begin[0].idPort).trigger("change");

      await getCabinetPorts(
        core.end[0].idObject,
        "#coreTNMD .endPort",
        core.end[0].idPort
      );
      $("#coreTNMD .endPort").val(core.end[0].idPort).trigger("change");
      await getSplitters(cableDetail[0].begin[0].id, ".beginDevice");
      $("#coreTNMD .beginDevice").val(core.begin[0].idDevice).trigger("change");
      await getSTPorts(
        core.begin[0].idDevice,
        "select.beginDevicePort",
        core.begin[0].idPortDevice
      );
      $("#coreTNMD select.beginDevicePort")
        .val(core.begin[0].idPortDevice)
        .trigger("change");
      $("#coreTNMD select.beginDevicePort").val(core.begin[0].portDeviceName);
      await getSplitters(cableDetail[0].end[0].id, ".endDevice");
      $("#coreTNMD .endDevice").val(core.end[0].idDevice).trigger("change");
      $("#coreTNMD .desc").val(core.note);
    }

    $("#coreTNMD").modal("show");
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
  // #BUTTON

  async function loadCableDetail() {
    listCore = await ajaxGET(`${APICollection.CABLECORES}/${cableId}`);
    var coreUsed = listCore.find((core) => core.status != 0);
    $(".core")
      .empty()
      .append(`${cableDetail[0].totalCore}/${coreUsed ? coreUsed.length : 0}`);

    table1.clear().draw();

    if (
      cableDetail[0].nameObjectBegin == "pop" &&
      cableDetail[0].nameObjectEnd == "cabinet"
    ) {
      for (let i = 0; i < listCore.length; i++) {
        const element = listCore[i];
        console.log(element);
        var statusIcon = createIcon(element.status);

        table1.row
          .add([
            "",
            element.id,
            element.code,
            element.name,
            element.begin[0].namePort ? element.begin[0].namePort : "",
            element.end[0].codePort
              ? element.end[0].codePort.split("-").slice(-1)[0]
              : "",
            element.begin[0].deviceName ? element.begin[0].deviceName : "",
            element.begin[0].portDeviceName
              ? element.begin[0].portDeviceName
              : "",
            element.end[0].deviceName ? element.end[0].deviceName : "",
            "",
            statusIcon,
            element.purpose != null ? element.purpose : "",
            element.note,
          ])
          .draw();
      }
    } else if (
      cableDetail[0].nameObjectBegin == "cabinet" &&
      cableDetail[0].nameObjectEnd == "cabinet"
    ) {
      for (let i = 0; i < listCore.length; i++) {
        const element = listCore[i];
        console.log(element);
        var statusIcon = createIcon(element.status);
        // var listSTBegin = await getSplitters(
        //   cableDetail[0].begin[0].id,
        //   ".beginDevice"
        // );
        // var findSTBegin = listSTBegin.find(
        //   (s) => s.id == element.begin[0].idDevice
        // );
        // var beginDevice = findSTBegin ? findSTBegin.name : "";

        table1.row
          .add([
            "",
            element.id,
            element.code,
            element.name,
            element.begin[0].codePort
              ? element.begin[0].codePort.split("-").slice(-1)[0]
              : "",
            element.end[0].codePort
              ? element.end[0].codePort.split("-").slice(-1)[0]
              : "",
            element.begin[0].deviceName ? element.begin[0].deviceName : "",
            element.begin[0].portDeviceName
              ? element.begin[0].portDeviceName
              : "",
            element.end[0].deviceName ? element.end[0].deviceName : "",
            "",
            statusIcon,
            element.purpose != null ? element.purpose : "",
            element.note,
          ])
          .draw();
      }
    }
  }

  // SUBMIT CORE MODAL
  $("#coreTNMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#coreTNMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    console.log(data);
    if (data.id == "") {
      message = [
        {
          idTbCable: parseInt(cableId),
          code: generateCode("CO"),
          name: data.name,
          note: data.desc,
          status: parseInt(data.status),
          begin: [
            {
              idObject:
                cableDetail[0].nameObjectBegin == "pop"
                  ? parseInt(data.ODF)
                  : parseInt(cableDetail[0].begin[0].id),
              tableName:
                cableDetail[0].nameObjectBegin == "pop" ? "odf" : "cabinet",
              idPort: parseInt(data.beginPort),
              idDevice: data.beginDevice ? parseInt(data.beginDevice) : 0,
              idPortDevice: data.beginDevicePort
                ? parseInt(data.beginDevicePort)
                : 0,
            },
          ],
          end: [
            {
              idObject: cableDetail[0].end[0].id,
              tableName: "cabinet",
              idPort: parseInt(data.endPort),
              idDevice: data.endDevice ? parseInt(data.endDevice) : 0,
              idPortDevice: 0,
            },
          ],
        },
      ];

      console.log(JSON.stringify(message));
      await ajaxPOST(`${APICollection.CABLECORE}`, message);
      loadCableDetail();
    } else {
      var core = listCore.find((c) => c.id == data.id);

      message = [
        {
          id: parseInt(data.id),
          idTbCable: parseInt(cableId),
          code: generateCode("CO"),
          name: data.name,
          note: data.desc,
          status: parseInt(data.status),
          begin: [
            {
              id: parseInt(core.begin[0].id),
              idObject:
                cableDetail[0].nameObjectBegin == "pop"
                  ? parseInt(data.ODF)
                  : parseInt(cableDetail[0].begin[0].id),
              tableName:
                cableDetail[0].nameObjectBegin == "pop" ? "odf" : "cabinet",
              idPort: parseInt(data.beginPort),
              idDevice: data.beginDevice ? parseInt(data.beginDevice) : 0,
              idPortDevice: data.beginDevicePort
                ? parseInt(data.beginDevicePort)
                : 0,
            },
          ],
          end: [
            {
              id: parseInt(core.end[0].id),
              idObject: cableDetail[0].end[0].id,
              tableName: "cabinet",
              idPort: parseInt(data.endPort),
              idDevice: data.endDevice ? parseInt(data.endDevice) : 0,
              idPortDevice: 0,
            },
          ],
        },
      ];

      console.log(JSON.stringify(message));
      await ajaxPUT(`${APICollection.CABLECORE}/${data.id}`, message);
      loadCableDetail();
    }
    $("#coreTNMD").modal("hide");
  });

  // SUBMIT CORES MODAL
  $("#coresTNMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#coresTNMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    console.log(data);

    if (
      cableDetail[0].nameObjectBegin == "pop" &&
      cableDetail[0].nameObjectEnd == "cabinet"
    ) {
      var ODFPorts = await ajaxGET(
        `${APICollection.ODFPORTS2}/${data.ODF}`
      ).then((res) => {
        return res.filter((p) => p.status == 0);
      });
      var ODFPortIndex = ODFPorts.findIndex((p) => p.id == data.beginPort);
      var checkODFEnoughPort = ODFPorts.length - ODFPortIndex >= data.core;

      var cabinetPorts = await ajaxGET(
        `${APICollection.CABINETPORTS2}/${cableDetail[0].end[0].id}`
      ).then((res) => {
        return res.filter((p) => p.status == 0);
      });
      var cabinetPortIndex = cabinetPorts.findIndex(
        (p) => p.id == data.endPort
      );
      var checkCabinetEnoughPort =
        cabinetPorts.length - cabinetPortIndex >= data.core;

      var createCores = [];
      // Check enough port
      if (
        ODFPorts.length >= parseInt(data.core) &&
        cabinetPorts.length >= parseInt(data.core) &&
        checkODFEnoughPort &&
        checkCabinetEnoughPort
      ) {
        for (let i = 0; i < data.core; i++) {
          var message = {
            idTbCable: parseInt(cableId),
            code: generateCode("CO"),
            name: `${data.prefix} ${parseInt(data.startNumber) + i}`,
            note: "",
            status: 0,
            begin: [
              {
                idObject: parseInt(data.ODF),
                tableName: "odf",
                idPort: parseInt(ODFPorts[i + ODFPortIndex].id),
                idDevice: 0,
                oltport: 0,
              },
            ],
            end: [
              {
                idObject: cableDetail[0].end[0].id,
                tableName: "cabinet",
                idPort: parseInt(cabinetPorts[i + cabinetPortIndex].id),
                idDevice: 0,
                idPortDevice: 0,
              },
            ],
          };
          createCores.push(message);
        }
        // console.log(createCores);
        console.log(JSON.stringify(createCores));
        await ajaxPOST(`${APICollection.CABLECORE}`, createCores);
        loadCableDetail();
        $("#coresTNMD").modal("hide");
      } else {
        $("#coresTNMD").modal("hide");
        $("#inforBody")
          .empty()
          .append("Không đủ số lượng port trống để tạo core.");
        $("#inforModal").modal("show");
      }
    } else if (
      cableDetail[0].nameObjectBegin == "cabinet" &&
      cableDetail[0].nameObjectEnd == "cabinet"
    ) {
      var cabinetBeginPorts = await ajaxGET(
        `${APICollection.CABINETPORTS2}/${cableDetail[0].begin[0].id}`
      ).then((res) => {
        return res.filter((p) => p.status == 0);
      });
      var cabinetBeginPortIndex = cabinetBeginPorts.findIndex(
        (p) => p.id == data.beginPort
      );
      var checkCabinetBeginEnoughPort =
        cabinetBeginPorts.length - cabinetBeginPortIndex >= data.core;

      var cabinetEndPorts = await ajaxGET(
        `${APICollection.CABINETPORTS2}/${cableDetail[0].end[0].id}`
      ).then((res) => {
        return res.filter((p) => p.status == 0);
      });
      var cabinetEndPortIndex = cabinetEndPorts.findIndex(
        (p) => p.id == data.endPort
      );
      var checkCabinetEndEnoughPort =
        cabinetEndPorts.length - cabinetEndPortIndex >= data.core;

      var createCores = [];
      // Check enough port
      if (
        cabinetBeginPorts.length >= parseInt(data.core) &&
        cabinetEndPorts.length >= parseInt(data.core) &&
        checkCabinetBeginEnoughPort &&
        checkCabinetEndEnoughPort
      ) {
        for (let i = 0; i < data.core; i++) {
          var message = {
            idTbCable: parseInt(cableId),
            code: generateCode("CO"),
            name: `${data.prefix} ${parseInt(data.startNumber) + i}`,
            note: "",
            status: 0,
            begin: [
              {
                idObject: cableDetail[0].begin[0].id,
                tableName: "cabinet",
                idPort: parseInt(
                  cabinetBeginPorts[i + cabinetBeginPortIndex].id
                ),
                idDevice: 0,
                idPortDevice: 0,
              },
            ],
            end: [
              {
                idObject: cableDetail[0].end[0].id,
                tableName: "cabinet",
                idPort: parseInt(cabinetEndPorts[i + cabinetEndPortIndex].id),
                idDevice: 0,
                idPortDevice: 0,
              },
            ],
          };
          createCores.push(message);
        }
        // console.log(createCores);
        // console.log(JSON.stringify(createCores));
        await ajaxPOST(`${APICollection.CABLECORE}`, createCores);
        loadCableDetail();
        $("#coresTNMD").modal("hide");
      } else {
        $("#coresTNMD").modal("hide");
        $("#inforBody")
          .empty()
          .append("Không đủ số lượng port trống để tạo core.");
        $("#inforModal").modal("show");
      }
    }
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

  ///////////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////
  // FUNCTION
  async function getCabinetPorts(id, className, idPortUsed) {
    await ajaxGET(`${APICollection.CB}/${id}`).then(async (res) => {
      for (let i = 0; i < res[0].blockTray.length; i++) {
        const element = res[0].blockTray[i];
        await ajaxGET(`${APICollection.CABINETPORTS}/${element.id}`).then(
          (res) => {
            $(`${className}`).append('<option value="0"></option>');
            for (let i = 0; i < res.length; i++) {
              const port = res[i];

              if (port.status == 0 || port.id == idPortUsed) {
                var name = port.name.split("-");
                var option = `<option value="${port.id}">${
                  name[name.length - 1]
                }</option>`;
                $(`${className}`).append(option);
              }
            }
          }
        );
      }
    });
  }

  async function getSplitters(id, className) {
    var result = await ajaxGET(`${APICollection.splittersCB}/${id}`).then(
      (res) => {
        // console.log(res);
        $(`#coreTNMD ${className}`).append('<option value="0"></option>');
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          var option = `<option value="${element.id}">${element.name}</option>`;
          $(`#coreTNMD ${className}`).append(option);
        }
        return res;
      }
    );
    return result;
  }

  async function getSTPorts(id, className, idPortUsed) {
    $(`#coreTNMD ${className}`)
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
            $(`#coreTNMD ${className}`).append(option);
          }
        }
      });
    }
  }

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

  async function getOLT(popId, className) {
    $(`${className}`)
      .find("option")
      .remove()
      .end()
      .append('<option value="0"></option>');
    await ajaxGET(`${APICollection.OLTBYPOP}/${popId}`).then((res) => {
      $(`${className}`).append('<option value="0"></option>');
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        var option = `<option value="${element.id}">${element.name}</option>`;
        $(`${className}`).append(option);
      }
    });
  }

  async function getOLTPorts(oltId, className, idPortUsed) {
    $(`${className}`)
      .find("option")
      .remove()
      .end()
      .append('<option value="0"></option>');
    await ajaxGET(`${APICollection.OLTPORTS}/${oltId}`).then((res) => {
      for (let j = 0; j < res.length; j++) {
        const port = res[j];
        if (port.status == 0 || port.id == idPortUsed) {
          var option = `<option value="${port.id}">${port.name}</option>`;
          $(`${className}`).append(option);
        }
      }
    });
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
});
