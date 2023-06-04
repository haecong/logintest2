let index = {
  init: function () {
    $("#saveBtn").on("click", () => {
      this.save();
    });
    $("#deleteBtn").on("click", () => {
      this.deleteById();
    });
  },

  deleteById: function () {
    var id = $("#id").text();

    // 삭제 버튼을 눌렀을 때 실행되는 함수
    var result = confirm("정말로 삭제하시겠습니까?"); // confirm 대화상자 표시

    if (result) {
      // 사용자가 확인 버튼을 클릭한 경우
      // 삭제 로직을 수행하는 코드를 작성합니다.
      // 예를 들어, AJAX 요청을 통해 서버에 삭제 요청을 보낼 수 있습니다.
      $.ajax({
        type: "DELETE",
        url: "/api/board" + id,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
      })
        .done(function (resp) {
          alert("삭제가 완료되었습니다.");
          location.href = "/";
        })
        .fail(function (error) {
          alert(JSON.stringify(error));
        });
    } else {
      alert("삭제를 취소합니다.");
    }
  },

  save: function () {
    let data = {
      title: $("#title").val(),
      content: $("#content").val(),
    };

    $.ajax({
      type: "POST",
      url: "/api/board",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    })
      .done(function (resp) {
        alert("글쓰기가 완료되었습니다.");
        location.href = "/";
      })
      .fail(function (error) {
        alert(JSON.stringify(error));
      });
  },
};

index.init();
