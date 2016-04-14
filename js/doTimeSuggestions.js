vg.parse.spec("json/timeSuggestionsSpec.json", function(chart) {
  chart({
      el: "#timeSuggestions",
      renderer: "svg"
    })
    .on("mouseover", function(event, item) {
      console.log(item);
      if (item && item.mark.name == "suggestion") {
        $('#tooltip').show();
            $('#tooltip').html(
              "<b>" + item.datum.Title + "</b><br>" +
              item.datum.Status_reason);
      } else {
        $('#tooltip').hide();
      }
    })
    .update();
});