vg.parse.spec("json/statusBarSpec.json", function (chart) {
  chart({
      el: "#statusBar",
      renderer: "svg"
    })
    .on("mouseover", function (event, item) {
      if (item && item.mark.name == "counts") {
        console.log(item)
        var date = new Date(item.datum.Date_submitted);
        $('#tooltip').show();
        $('#tooltip').html(
          item.datum.count_Title + " suggestions"
        );
      } else {
        $('#tooltip').hide();
      }
    })
    .update();
});