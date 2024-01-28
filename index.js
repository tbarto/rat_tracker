/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
let map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 42.3601, lng: -71.0589 },
    mapTypeId: "satellite",
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map,
  });
  map.addListener("click", 	addPoint);
}

function addPoint(e) {
	console.log(e)

	// Get lat and long from click event
	const latitude = e.latLng.toJSON()["lat"]
	const longitude = e.latLng.toJSON()["lng"]

	// Insert this lat/long into DynamoDB by calling API Gateway
	fetch('https://yowmxwf75c.execute-api.us-east-1.amazonaws.com/prod', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin':'*',
			'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
		},
		body: JSON.stringify({
			 "latitude": latitude,
			 "longitude": longitude 
			})
	})
	   .then(response => response.json())
	   .then(response => console.log(JSON.stringify(response)))


	// Create a new point with the lat and long from click event
	const point = new google.maps.LatLng(latitude, longitude)

	// Add the new point to the heatmap
	heatmap.data.push(point)
  }

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

// Heatmap data: 500 Points
function getPoints() {
  
  // Fetch real data points from DynamoDB and insert them into an array like below
 const maxLat = 42.38183294441887
 const minLat = 42.3342011325971
 const minLong = -71.10324660580274
 const maxLong = -71.02780143063184

 let randomDataPoints = []

 // loop 500 times and create a new random data point in that range
 for (let i = 0; i < 500; i++) {
	let lat = Math.random() * (maxLat - minLat) + minLat
	let long = Math.random() * (maxLong - minLong) + minLong
	let randomPoint = new google.maps.LatLng(lat, long)
	randomDataPoints.push(randomPoint)
  }
  
  return randomDataPoints
}

window.initMap = initMap;
