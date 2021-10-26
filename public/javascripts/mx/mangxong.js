$(document).ready(async function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  var table = $("#main_table").DataTable({
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
        className: "code",
      },
      // {
      //   targets: -2,
      //   inforStore: null,
      //   className: "edit",
      //   defaultContent:
      //     "<button class='btn btn-primary editBtn'><i class='fas fa-pencil-alt'></button>",
      //   // width: "10%",
      //   orderable: false,
      // },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        // width: "10%",
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

  var listMX;
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
  $("#main_table tbody").on("click", "button.editBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    const mx = listMX.find((x) => x.id == id);

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

    $("#mxModal").modal("show");
  });
  $("#main_table tbody").on("click", "button.deleteBtn", function (event) {
    event.preventDefault();
    const id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("1");
    $("#deleteURL").val(`${APICollection.MX}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });
  //#endregion

  // SUBMIT MODAL
  //#region
  $("#mxModal").submit(async function (event) {
    event.preventDefault();
    var data = $("form#mxModal")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    const mx = listMX.find((m) => m.id == data.id);
    var formatDate = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    var message = [
      {
        id: parseInt(data.id),
        idTbPop: parseInt(data.pop),
        code: data.code,
        name: data.name,
        length: parseInt(data["length"]),
        date: formatDate,
        pos: mx.pos,
        status: parseInt(data.status),
      },
    ];
    // console.log(JSON.stringify(message));
    await ajaxPUT(`${APICollection.MX}/${data.id}`, message);
    loadDataTable();

    $("#mxModal").modal("hide");
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

  // LOAD DATA TO TABLE
  async function loadDataTable() {
    listMX = await ajaxGET(APICollection.MX);

    table.clear().draw();

    for (let i = 0; i < listMX.length; i++) {
      const e = listMX[i];
      var tmp = listPops.find((p) => p.id == e.idTbPop);
      var x = "";
      formatDate = moment(e.date).format("DD/MM/YYYY");
      if (tmp != undefined) {
        x = tmp.name;
      }
      table.row.add(["", e.id, e.name, e["length"], formatDate, x]).draw();
    }
  }
});
