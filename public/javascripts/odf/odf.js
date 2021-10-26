var odfTable;
var odfDetailTable;
$(document).ready(async function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  odfTable = $("#odf_table").DataTable({
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
        targets: -3,
        inforStore: null,
        className: "detail",
        defaultContent:
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></i></button>",
        orderable: false,
        width: "5%",
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
  odfDetailTable = $("#odf_detail_table").DataTable({
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
  // ĐÁNH STT TỰ ĐỘNG
  //#region
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
  odfDetailTable
    .on("order.dt search.dt", function () {
      odfDetailTable
        .column(0, { search: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();
  //#endregion

  var dataODF, datacoreODFDetail;
  dataODF = await ajaxGET(APICollection.ODF).then((res) => {
    loadDataTable(odfTable, res);
    return res;
  });

  // BUTTON EVENT
  //#region
  $("#addOdfButton").on("click", (event) => {
    event.preventDefault();

    $("#odfModal").modal("show");
  });
  $("#odf_table tbody").on("click", "button.detailBtn", async function () {
    var id = $(this).parent().parent().children().first().next().text();
    var x = dataODF.find((o) => o.id == id);
    $("#detailODF .odfId").empty().append(id);
    $("#detailODF .odfName").empty().append(x.name);

    datacoreODFDetail = await ajaxGET(
      `${APICollection.coreOdfDetails}/${id}`
    ).then((res) => {
      loadODFDetail(odfDetailTable, res);
      return res;
    });

    $("#detailODF").modal("show");
  });
  $("#odf_table tbody").on("click", "button.editBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();
    var x = dataODF.find((o) => o.id == id);
    $("#odfId").val(x.id);
    $("#odfCode").val(x.code);
    $("#odfName").val(x.name);
    $("#odfPop").val(x.idTbPop).trigger("change");
    $("#odfDesc").val(x.description);

    $("#odfModal").modal("show");
  });
  $("#odf_table tbody").on("click", "button.deleteBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();

    $("#deleteModal").modal("show");
  });
  // /////////////////////////////////////////////
  $("#addDetailODF").on("click", (event) => {
    event.preventDefault();

    $("#coreODFModal").modal("show");
  });
  $("#odf_detail_table tbody").on("click", "button.editBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();
    var x = datacoreODFDetail.find((d) => d.id == id);
    console.log(x);
    $("#coreODFId").val(x.id);
    $("#coreODFExplain").val(x.note);
    $("#coreODFCable").val(x.cableNote);
    $("#coreODFStartPort").val(parseInt(x.beginPort));
    $("#coreODFEndPort").val(parseInt(x.endPort));
    $("#coreODFDesc").val(x.description);

    $("#coreODFModal").modal("show");
  });
  $("#odf_detail_table tbody").on("click", "button.deleteBtn", function () {
    var id = $(this).parent().parent().children().first().next().text();

    $("#deleteModal").modal("show");
  });
  //#endregion

  // SUBMIT MODAL
  //#region
  $("#odfModal").submit(async function (event) {
    event.preventDefault();
    const formData = $("form#odfModal").serializeArray();
    const id = formData.find((d) => d.name == "odfId").value;
    const code = formData.find((d) => d.name == "odfCode").value;
    const name = formData.find((d) => d.name == "odfName").value;
    const pop = formData.find((d) => d.name == "odfPop").value;
    const description = formData.find((d) => d.name == "odfDesc").value;
    if (id == "") {
      var data = [
        {
          idTbPop: parseInt(pop),
          code: generateCode("ODF"),
          name,
          description,
        },
      ];
      await ajaxPOST(APICollection.ODF, data).then(async () => {
        $("#odfModal").modal("hide");
        odfTable.clear().draw();
        dataODF = await ajaxGET(APICollection.ODF).then((res) => {
          loadDataTable(odfTable, res);
          return res;
        });
        toastSuccess("Tạo mới thành công");
      });
    } else {
      var data = [
        {
          id,
          idTbPop: parseInt(pop),
          code,
          name,
          description,
        },
      ];
      await ajaxPUT(`${APICollection.ODF}/${id}`, data).then(async () => {
        $("#odfModal").modal("hide");
        odfTable.clear().draw();
        dataODF = await ajaxGET(APICollection.ODF).then((res) => {
          loadDataTable(odfTable, res);
          toastSuccess("Cập nhật thành công");
          return res;
        });
      });
    }
  });
  $("#deleteModal").submit(async function (event) {
    event.preventDefault();
  });

  $("#coreODFModal").submit(async function (event) {
    event.preventDefault();
    var odfId = $("#detailODF .odfId").text();
    const formData = $("form#coreODFModal").serializeArray();
    const id = formData.find((d) => d.name == "coreODFId").value;
    const explain = formData.find((d) => d.name == "coreODFExplain").value;
    const cableNote = formData.find((d) => d.name == "coreODFCable").value;
    const beginPort = formData.find((d) => d.name == "coreODFStartPort").value;
    const endPort = formData.find((d) => d.name == "coreODFEndPort").value;
    const description = formData.find((d) => d.name == "coreODFDesc").value;
    if (id == "") {
      var data = [
        {
          idTbOdf: parseInt(odfId),
          description,
          cableNote,
          note: explain,
          beginPort: parseInt(beginPort),
          endPort: parseInt(endPort),
        },
      ];
      await ajaxPOST(APICollection.OdfDetails, data).then(async () => {
        $("#coreODFModal").modal("hide");
        datacoreODFDetail = await ajaxGET(
          `${APICollection.coreOdfDetails}/${odfId}`
        ).then((res) => {
          loadODFDetail(odfDetailTable, res);
          return res;
        });
        toastSuccess("Tạo mới thành công");
      });
    } else {
      var data = [
        {
          id: parseInt(id),
          idTbOdf: parseInt(odfId),
          description,
          cableNote,
          note: explain,
          beginPort: parseInt(beginPort),
          endPort: parseInt(endPort),
        },
      ];
      // console.log(JSON.stringify(data));
      await ajaxPUT(`${APICollection.OdfDetails}/${id}`, data).then(
        async () => {
          $("#coreODFModal").modal("hide");
          datacoreODFDetail = await ajaxGET(
            `${APICollection.coreOdfDetails}/${odfId}`
          ).then((res) => {
            loadODFDetail(odfDetailTable, res);
            return res;
          });
          toastSuccess("Cập nhật thành công");
        }
      );
    }
  });
  //#endregion

  // TOPBAR EVENT
  //#region
  $("#provinceTB").on("select2:select", function (e) {
    const data = e.params.data;
    alert("***Tính năng chưa hoàn thiện");
  });
  $("#popTB").on("select2:select", async function (e) {
    const data = e.params.data;
    alert("***Tính năng chưa hoàn thiện");
  });
  //#endregion
});

// LOAD DATA TO TABLE
async function loadDataTable(table, data) {
  var pops = await ajaxGET(`${APICollection.POP}`);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    var x = pops.find((p) => p.id == e.idTbPop);
    if (x != undefined) {
      x = x.name;
    } else {
      x = "";
    }
    table.row.add(["", e.id, e.name, x, e.description]).draw();
  }
}

async function loadODFDetail(table, data) {
  table.clear().draw();
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    table.row
      .add([
        "",
        e.id,
        e.note,
        e.cableNote,
        e.beginPort,
        e.endPort,
        e.description,
      ])
      .draw();
  }
}

// CHỈNH LẠI DATATABLE HEADER
$("#detailODF").on("shown.bs.modal", function () {
  $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});
// CLEAR MODAL
$("#odfModal").on("hidden.bs.modal", function (e) {
  $("#odfModal form :input").val("");
});
// LOAD LIST POP
ajaxGET(APICollection.POP).then((res) => {
  for (let i = 0; i < res.length; i++) {
    const e = res[i];
    var option = `<option value="${e.id}">${e.name}</option>`;
    $("#odfPop").append(option);
  }
});
