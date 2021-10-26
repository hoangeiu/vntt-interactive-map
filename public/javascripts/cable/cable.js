$(document).ready(async function () {
  // DEFINE TABLE AND IT ATTRIBUTE
  const table = $("#cable_table").DataTable({
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
          "<button class='btn btn-success detailBtn'><i class='fas fa-info-circle'></i></button>",
        orderable: false,
        width: "5%",
      },
      // {
      //   targets: -2,
      //   inforStore: null,
      //   className: "edit",
      //   defaultContent:
      //     "<button class='btn btn-primary editBtn'><i class='fas fa-pencil-alt'></i></button>",
      //   width: "5%",
      // },
      {
        targets: -1,
        inforStore: null,
        className: "delete",
        defaultContent:
          "<button class='btn btn-danger deleteBtn'><i class='fas fa-trash-alt'></i></button>",
        width: "5%",
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

  var listCable;
  var listPops = await ajaxGET(`${APICollection.POP}`).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const e = res[i];
      var option = `<option value="${e.id}">${e.name}</option>`;
      $(".pop").append(option);
    }
    return res;
  });

  for (let i = 0; i < LISTTYPES.length; i++) {
    const e = LISTTYPES[i];
    var option = `<option value="${e.id}">${e.name}</option>`;
    $("#cableMD .type").append(option);
  }

  loadDataTable();

  // BUTTON EVENT
  //#region
  $("#cable_table tbody").on("click", "button.detailBtn", function (event) {
    event.preventDefault();
    var id = $(this).parent().parent().children().first().next().text();
    var cable = listCable.find((c) => c.id == id);
    if (cable.iD_tbCableType == 1) {
      window.open(
        `${MAINURL}/device-management/managed-cables/tt/?cableId=${id}`
      );
    } else if (cable.iD_tbCableType == 2) {
      window.open(
        `${MAINURL}/device-management/managed-cables/tn/?cableId=${id}`
      );
    }
  });
  $("#cable_table tbody").on("click", "button.editBtn", async function () {
    var id = $(this).parent().parent().children().first().next().text();
    const cable = listCable.find((c) => c.id == id);
    $("#copy").hide();
    $("#cableMD .id").val(cable.id);
    $("#cableMD .code").val(cable.code);
    $("#cableMD .name").val(cable.name);
    $("#cableMD .connection").val(cable.connect);
    $("#cableMD .capacity").val(cable.capacity);
    $("#cableMD .length").val(cable["length"]);
    $("#cableMD .reference").val(cable.reference);
    var formatDate = moment(cable.completeDate).format("DD/MM/YYYY");
    $('#cableMD input[name="date"]')
      .data("daterangepicker")
      .setStartDate(formatDate);
    $('#cableMD input[name="date"]')
      .data("daterangepicker")
      .setEndDate(formatDate);

    $("#cableMD .type").val(cable.iD_tbCableType).trigger("change");

    $("#cableMD .pop").val(cable.id_tbPOP).trigger("change");

    if (cable.begin.length > 0) {
      var option = `<option value="${cable.begin[0].id}">${cable.begin[0].name}</option>`;
      $("#cableMD .start").append(option);
      $("#cableMD .start").val(cable.begin[0].id).trigger("change");
      $("#cableMD .start").prop("disabled", true);
    }
    if (cable.end.length > 0) {
      var option = `<option value="${cable.end[0].id}">${cable.end[0].name}</option>`;
      $("#cableMD .end").append(option);
      $("#cableMD .end").val(cable.end[0].id).trigger("change");
      $("#cableMD .end").prop("disabled", true);
    }

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
  });
  $("#cable_table tbody").on("click", "button.deleteBtn", function (event) {
    event.preventDefault();
    const id = $(this).parent().parent().children().first().next().text();
    $("#deleteType").val("1");
    $("#deleteURL").val(`${APICollection.Cable}`);
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
  });
  //#endregion

  // SUBMIT MODAL
  //#region
  $("#cableMD").submit(async function (event) {
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

    var typeCableArray = [];
    for (let i = 0; i < attribute.length; i++) {
      const element = attribute[i];
      typeCableArray.push({ attribute: parseInt(element.value) });
    }

    const cable = listCable.find((c) => c.id == id);

    var data = [
      {
        id,
        iD_tbCableType: parseInt(type),
        code,
        name,
        connect: connection,
        capacity,
        length,
        reference,
        completeDate: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        posBegin: cable.posBegin,
        posEnd: cable.posEnd,
        id_tbPOP: parseInt(pop),
        iD_tbCableAttribute: 1,
        posArray: cable.posArray,
        idObjectBegin: cable.idObjectBegin,
        nameObjectBegin: cable.nameObjectBegin,
        idObjectEnd: cable.idObjectEnd,
        nameObjectEnd: cable.nameObjectEnd,
        totalCore: parseInt(capacity),
        typeCableArray: JSON.stringify(typeCableArray),
      },
    ];
    await ajaxPUT(`${APICollection.Cable}/${id}`, data);
    $("#cableMD").modal("hide");
    loadDataTable();
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
    listCable = await ajaxGET(APICollection.Cable);

    table.clear().draw();

    for (let i = 0; i < listCable.length; i++) {
      const element = listCable[i];
      console.log(element);
      table.row
        .add([
          "",
          element.id,
          element.name,
          element.connect,
          element.capacity,
          element["length"],
          element.begin.length > 0 ? element.begin[0].name : "",
          element.end.length > 0 ? element.end[0].name : "",
        ])
        .draw();
    }
  }
});
