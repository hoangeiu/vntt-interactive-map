$(document).ready(async function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  const table = $("#cabinet_table").DataTable({
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
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></button>",
        width: "10%",
        orderable: false,
      },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        width: "10%",
        orderable: false,
      },
    ],
  });
  // ĐÁNH STT TỰ ĐỘNG
  table
    .on("order.dt search.dt", function () {
      table
        .column(0, { search: "applied", order: "applied" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = i + 1;
        });
    })
    .draw();

  // KHỞI TẠO BẢNG
  var listCB;
  var listPops = await ajaxGET(`${APICollection.POP}`).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const e = res[i];
      var option = `<option value="${e.id}">${e.name}</option>`;
      $(".pop").append(option);
    }
    return res;
  });
  loadDataTable();

  // BUTTON EVENT
  //#region
  $("#cabinet_table tbody").on("click", "button.detailBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    window.open(
      `${MAINURL}/device-management/managed-cabinets/?cabinetId=${id}`
    );
  });
  $("#cabinet_table tbody").on("click", "button.editBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    const cabinet = listCB.find((d) => d.id == id);
    $("#cabinetMD .id").val(cabinet.id);
    $("#cabinetMD .code").val(cabinet.code);
    $("#cabinetMD .name").val(cabinet.name);
    $("#cabinetMD .portIn").val(cabinet.totalPortIn);
    $("#cabinetMD .portOut").val(cabinet.totalPortOut);
    $("#cabinetMD .desc").val(cabinet.description);
    $("#cabinetMD .pop").val(cabinet.idTbPop).trigger("change");
    $("#cabinetMD").modal("show");
  });

  $("#cabinet_table tbody").on("click", "button.deleteBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("1");
    $("#deleteURL").val(`${APICollection.CB}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });
  //#endregion

  // SUBMIT MODAL
  //#region
  $("#cabinetMD").submit(async function (event) {
    event.preventDefault();
    var data = $("form#cabinetMD")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    var x = listCB.find((d) => d.id == data.id);
    var message = [
      {
        id: data.id,
        idTbPop: parseInt(data.pop),
        code: data.code,
        name: data.name,
        totalPortIn: parseInt(data.portIn),
        totalPortOut: parseInt(data.portOut),
        description: data.desc,
        index: 0,
        pos: x.pos,
      },
    ];
    await ajaxPUT(`${APICollection.CB}/${data.id}`, message);
    loadDataTable();
    $("#cabinetMD").modal("hide");
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
    loadDataTable();
    $("#deleteModal").modal("hide");
  });
  //#endregion

  async function loadDataTable() {
    listCB = await ajaxGET(APICollection.CB).then((res) => {
      return res.filter((x) => x.index == 0);
    });

    table.clear().draw();

    for (let i = 0; i < listCB.length; i++) {
      const e = listCB[i];
      console.log(e);
      var x = "";
      var tmp = listPops.find((p) => p.id == e.idTbPop);
      if (tmp != undefined) {
        x = tmp.name;
      }

      table.row.add(["", e.id, e.name, e.totalPort, e.description, x]).draw();
    }
  }
});
