$(document).ready(function () {
  $("#form-signin").submit(async function (event) {
    event.preventDefault();
    var data = $("form#form-signin")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});
    var message = {
      username: data.username,
      password: data.password,
    };
    await $.ajax({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      url: `${APICollection.users}`,
      data: JSON.stringify(message),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        localStorage.setItem("_token", response.token);
        localStorage.setItem("_exp", response.exp);
        localStorage.setItem("_username", response.username);
        window.location.replace(`${MAINURL}`);
      },
      error: function (error) {
        $("#form-signin .error").empty().append(error.responseJSON.message);
        $("#inputUsername").val("");
        $("#inputPassword").val("");
      },
    });
  });
});
