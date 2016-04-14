vg.parse.spec("json/deadlinePiSpec.json", function (chart) {
  chart({
      el: "#deadlinePi",
      renderer: "svg"
    })
    .update();
});