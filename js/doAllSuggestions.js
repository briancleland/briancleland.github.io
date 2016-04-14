vg.parse.spec("json/allSuggestionsSpec.json", function (chart) {
      chart({
          el: "#allSuggestions",
          renderer: "svg"
        })
        .update();
    });