vg.parse.spec("json/timeSuggestionsSpec.json", function (chart) {
  chart({
      el: "#timeSuggestions",
      renderer: "svg"
    })
    .update();
});