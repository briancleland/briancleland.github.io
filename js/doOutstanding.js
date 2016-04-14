    vg.parse.spec("json/outstandingSpec.json", function (chart) {
      chart({
          el: "#outstanding",
          renderer: "svg"
        })
        .on("mouseover", function (event, item) {
        var temp = item;
          console.log(item);
          if (item && item.mark.name == "requests") {
            $('#tooltip').show();
            $('#tooltip').html(
              "<b>" + item.datum.Title + "</b><br>" +
              item.datum.Status_reason + "<br>" + 
              item.datum.Response_outstanding_days + " days<br>");
          } else {
            $('#tooltip').hide();
          }
        })
        .update();
    });