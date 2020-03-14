var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([38.70, 9.01]),
        zoom: 12
      })
    });
var layer = new ol.layer.Vector({
   source: new ol.source.Vector({
   }),
   style: new ol.style.Style( {
        image: new ol.style.Circle( {
            radius: 5,
            text: "test",
            fill: new ol.style.Fill( {
                color: '#2e279d'
            } )
        } ) })
 });
var old = new ol.layer.Vector({
  source: new ol.source.Vector({
  })
})
   map.addLayer(layer)
   map.addLayer(old)
map.on('singleclick', function (event) {
   var lonlat = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
   layer.getSource().clear()
   layer.getSource().addFeature(
      new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([lonlat[0],lonlat[1]]))
      })
    )
    $("#dropoff").css("display","block")
   // console.log(map.getLayers())
});
var current_change = 0
function refreshChange() {
  current_change = Cookies.get("current_change")
  if(current_change === undefined) {
    current_change = 0
  }
  $("#current_change").text(current_change)
}

$("#dropoff").click(function() {
  var json = {}
  json.name = $("#adding_name").val()
  if(json.name === "") {
    json.name = "Anonymous"
  }
  json.amount = "$"+$("#adding_amount").val()
  json.instructions = $("#instructions").val()
  var latlong = ol.proj.transform(layer.getSource().getFeatures()[0].values_.geometry.flatCoordinates,'EPSG:3857', 'EPSG:4326')
  json.latlong = latlong
  // $.post("http://127.0.0.1:5000", JSON.stringify(json),
  // function(data, status){
  //   console.log(data)
  // });
  $.ajax({
  method: "POST",
  url: "http://127.0.0.1:5000",
  data:JSON.stringify(json),
  contentType: "application/json"
})
  .done(function( msg ) {
    alert( "Data Saved: " + msg );
    var flags = Cookies.get("flags")
    if(flags != undefined){
      flags = JSON.parse(flags)
      flags.push(latlong)
    } else {
      flags = [latlong]
    }
    console.log(flags)
    Cookies.set("flags",JSON.stringify(flags));
  });
})

// $("#adding_amount").change(function(){
//   var amount = $("#adding_amount").val()
//   console.log(amount)
//   Cookies.set("current_change",parseInt(current_change)+parseInt(amount))
//   refreshChange()
// })

refreshChange()
init()
//map.addLayer(layer);
// $(".esc-policy  a").on('click',function(){
//    var name = $("#nameInput").val(),
//    description = $("#descriptionInput").val();
//    $.cookie('back_to_url_onPage_referesh', 1);
//    $.cookie('name',name);
//    $.cookie('description',description);
// });
function init() {
  var points = Cookies.get("flags")
  if(points != undefined) {
    points = JSON.parse(points)
    for(var point in points) {
       var lonlat = points[point]
       console.log(lonlat)
       old.getSource().addFeature(
          new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lonlat[0],lonlat[1]]))
          })
        )
    }
  }
}