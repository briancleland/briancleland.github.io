
vg.parse.spec("json/responsiveSpec.json", function (chart) {
      chart({
          el: "#responsive",
          renderer: "svg"
        })
        .on("mouseover", function (event, item) {
          console.log(item);
          if (item && item.mark.name == "numRequests") {
            $('#tooltip').show();
            $('#tooltip').html(
              Math.round(item.datum.mean_Response_time*10)/10 + " days"
            );
          } else {
            $('#tooltip').hide();
          }
        })
        .update();
    });