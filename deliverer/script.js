// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(init);
// } else {
//   alert("Geolocation is not supported by this browser.");
// }

const socket = new WebSocket('ws://localhost:5001');
socket.addEventListener('message', function (event) {
    add_delivery(event.data)
});

var index = 1

var view = new ol.View({
        center: ol.proj.fromLonLat([38.75, 8.98]),
        zoom: 12
      })

var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: view
    });

var layer = new ol.layer.Vector({
   source: new ol.source.Vector({
   }),
   style: new ol.style.Style( {
        image: new ol.style.Circle( {
            radius: 6,
            text: "test",
            fill: new ol.style.Fill( {
                color: '#2e279d'
            } )
        } ) })
 });
map.addLayer(layer)

function add_delivery(data) {
    console.log(data)
    var delivery = JSON.parse(data)
    var name = delivery.name
    var amount = delivery.amount
    var instructions = delivery.instructions
    var latlong = delivery.latlong
    layer.getSource().addFeature(
      new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(latlong))
      })
    )
    var card_string = `<div class='delivery'><h3>${name}</h3><h3>${amount}</h3><p>${instructions}</p><button id=card${index}>Accept</button></div>`
    $("#deliveries").append(card_string)
    $("#card"+index).click(function(){
        var location = ol.proj.fromLonLat(latlong);
        flyTo(location,function() {})
    });
    index++

    // var li_string = `<li>${name} ${amount} ${instructions}</li>`
    // $("#list").append(li_string);
}

function flyTo(location, done) {
  var duration = 2000;
  var zoom = view.getZoom();
  var parts = 2;
  var called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate({
      zoom:12,
      duration: duration/2
    },function(){
      view.animate({
        center: location,
        duration: duration/2
      });
      view.animate({
        zoom: 17,
        duration: duration
      })
    }
  )
}


// function init() {
  
// var points = [[38.71,9.02],[38.75,9.00]]

// for(var point in points) {
//    var lonlat = points[point]
//    layer.getSource().addFeature(
//       new ol.Feature({
//             geometry: new ol.geom.Point(ol.proj.fromLonLat([lonlat[0],lonlat[1]]))
//       })
//     )
// }
// layer.getSource().addFeature(
//       new ol.Feature({
//             geometry: new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude,position.coords.latitude]))
//       })
//     )
// }

