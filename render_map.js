// TODO: add a legend for each color of category
var map;
var gmarkers = [];
var image = [];
var infowindow;
var maxCountByCategory = {};  // for scaling size of circle. keeps track of maxCount for each category

function initMap() {
  // set checkbox default property
  $('.category').prop('checked', false);
  $('.subcategory').prop('checked', false);


  // create the map
  var mapOptions = {
    zoom: 13,
    center: {lat: 40.101394, lng: -88.227398},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // get JSON data and add each place to the gmarkers list
  $.when(
    // chrome settings don't allow loading local files, so i had to upload the following files to a public location
    // $.getJSON("https://raw.githubusercontent.com/adinger/AlgorithmicMap/master/data/city_coordinates.json"),
    // $.getJSON("https://raw.githubusercontent.com/adinger/AlgorithmicMap/master/data/cities_by_category.json")
    $.getJSON("https://raw.githubusercontent.com/zgy921028/BizCompare467Final/master/data/parsed.json"),
    $.getJSON("https://raw.githubusercontent.com/zgy921028/BizCompare467Final/master/data/name_category_dict.json"),
    $.getJSON("https://raw.githubusercontent.com/zgy921028/BizCompare467Final/master/data/name_img_dict.json")
  ).done(function (buzData, name_cat, name_img) {
    var buzData = JSON.parse(buzData[2].responseText);
    var name_cat = JSON.parse(name_cat[2].responseText);
    var name_img = JSON.parse(name_img[2].responseText);
    // console.log(name_img)

    // console.log(buzData['fazolis-champaign'])
    for(key in buzData){
      // console.log(buzData[key].info)
      buzObj = buzData[key];
    //     cityName = cityObj.city;
      lat = buzObj['info']["lat"];
      lon = buzObj['info']["lon"];
      buzName = buzObj['info']['name'];
      // console.log(key)
      // console.log(buzName)
      // console.log(name_img[buzName])

      cat_link = name_cat[buzName]
      img_link = name_img[buzName]
      addLocation(buzObj, lat, lon, key, cat_link, img_link);
    }
  });

  // adds the place to the gmarkers list
  function addLocation(buzObj, lat, lon, key, cat_link, img_link) {
    //alert(maxCountByCategory[category]);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      map: map,
      id: key,
      icon: getCircle(5, "asianfusion", 2, 10)
    });
    // marker.mycategory = category;
    var infowindow = new google.maps.InfoWindow({
      content: ''
    });
    // var cityName = cityObj.city.replace('_', ' ');
    // var cat = category.charAt(0).toUpperCase() + category.slice(1);  // capitalize first letter
    console.log(img_link)

    var contentString = 
      '<h4>'+key +'</h4>' +
      '<div> image <img src=' + img_link[0] +' > ' +
      'category: ' + cat_link[1]+' <img src='+cat_link[0]+'>' +
      '<iframe src="file:///Users/DavidZhou/GDriveUIUC/16sp/viz/final/charts-info-graphic/index.html"></iframe>' + 
      '</div>'

    bindInfoWindow(marker, map, infowindow, contentString, key, buzObj)
    // bindInfoWindow(marker, map, infowindow, '<h4>'+key +
    //   '</h4><p>Average rating: </p><p>Count:</p> <div> image <img src=' + img_link[0] +' > category: ' + cat_link[1]+' <img src='+cat_link[0]+'><iframe src="file:///Users/DavidZhou/GDriveUIUC/16sp/viz/final/charts-info-graphic/index.html"></iframe> </div>', key, buzObj)
    marker.setVisible(true);
    gmarkers.push(marker);
    return 0;
  }

      


  function bindInfoWindow(marker, map, infowindow, html, key, buzObj) {
    google.maps.event.addListener(marker, 'dblclick', function() { 
      infowindow.setContent(html); 
      infowindow.open(map, marker); 
    }); 
    // google.maps.event.addListener(marker, 'mouseout', function() { 
    //   infowindow.close(); 
    // }); 
    google.maps.event.addListener(marker, 'click', function() { 
      // infowindow.close(); 
      // infowindow.setContent(html); 
      // infowindow.open(map, marker); 
      console.log(buzObj['related'])
      for (var i = 0; i < gmarkers.length; i++) {
        if (gmarkers[i].id  == key) 
        {
          // gmarkers[i].setVisible(false);
          // gmarkers[i].icon = getCircle(3, "italian", 10, 10)  
          // console.log(gmarkers[i].icon)
          gmarkers[i].setVisible(true);

        }
        else if (buzObj['related'].indexOf(gmarkers[i].id) > 0 )
          gmarkers[i].setVisible(true);
        else
          gmarkers[i].setVisible(false);
      }
    }); 
    google.maps.event.addListener(marker, 'rightclick', function() { 
      // infowindow.close(); 
      for (var i = 0; i < gmarkers.length; i++) {
      // if (gmarkers[i].id  == key) 
        gmarkers[i].setVisible(true);
      }
    });
  }

  // shows the marker if it should be shown (helper for boxclick())
  // function show(key) {
  //   for (var i = 0; i < gmarkers.length; i++) {
  //     if (gmarkers[i].id  == key) 
  //       gmarkers[i].setVisible(true);
  //     else
  //       gmarkers[i].setVisible(false);
  //   }
  //   // document.getElementById(category).checked = true;
  //   // $('#'+category).prop('checked', true);
  // }

  // // hides the marker if it should be hidden (helper for boxclick())
  // function hide(category) {
  //   for (var i = 0; i < gmarkers.length; i++) {
  //     if (gmarkers[i].mycategory == category) 
  //       gmarkers[i].setVisible(false);
  //   }
  //   document.getElementById(category).checked = false;
  //   $('#'+category).prop('checked', false);
  // }

  // shows the markers if their category is checked, hides them if unchecked
  // function boxclick(box,category) {
  //   if (box.checked || $(box).prop('checked')) {
  //     show(category);
  //   } else {
  //     hide(category);
  //   }
  // }

  // $('.subcategory').click(function (event) {
  //   $(this).prop('checked', this.checked);
  //   boxclick(this, event.target.id);  // the id of the clicked checkbox contains the category name
  // });


  //// click handlers for the super categories
  cuisines = ["asianfusion","latin","southern","italian","greek","mediterranean"];
  activities = ["scuba", "rafting", "surfing","skydiving","hiking","beaches"];

  $('#allcuisines').click(function (event) {
    for (var c in cuisines) {      
      cuisine = cuisines[c];
      $('#'+cuisine).prop('checked', this.checked);
      boxclick($('#'+cuisine), cuisine);
    }
  });

  $('#allactivities').click(function (event) {
    for (var c in activities) {      
      activity = activities[c];
      $('#'+activity).prop('checked', this.checked);
      boxclick($('#'+activity), activity);
    }
  });
} 

jQuery(document).ready(function(){
  initMap();
});

var colors = {  // CSS colors for each category
  "asianfusion":"deepskyblue",
  "latin":"purple",
  "southern":"orchid",
  "italian":"orangered",
  "greek":"lightseagreen",
  "mediterranean":"green",
  "scuba":"deeppink",
  "rafting":"royalblue",
  "surfing":"turquoise",
  "skydiving":"mediumvioletred",
  "hiking":"violet",
  "beaches":"darksalmon"
}

// creates the circle using the magnitude to determine size
function getCircle(score, category, count, maxCount) {
  //if (activities.indexOf(category) > -1) count *= 10;
  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: colors[category],
    fillOpacity: score/5,
    scale: 30*count/maxCount, //Math.pow(2, score),
    strokeColor: 'white',
    strokeWeight: .5
  };
  return circle;
}