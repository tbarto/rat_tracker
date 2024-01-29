/* global google */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">
let map, heatmap, pointArray;

function initMap() {

	const points = getPoints()

	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 13,
		center: { lat: 42.3601, lng: -71.0589 },
		mapTypeId: "satellite",
	});
	map.addListener("click", addPoint);
}

function addPoint(e) {

	// Get lat and long from click event
	const latitude = e.latLng.toJSON()["lat"]
	const longitude = e.latLng.toJSON()["lng"]

	// Insert this lat/long into DynamoDB by calling API Gateway
	fetch('https://yowmxwf75c.execute-api.us-east-1.amazonaws.com/prod/rat-location', {
		method: 'POST',
		body: JSON.stringify({
			"latitude": latitude,
			"longitude": longitude
		})
	})
		.then(response => {
			if (response.status != 201) {
				throw new Error('unable to create new data point');
			}
			console.log("successfully added data point")
			return response.json()
		})
		.then(data => {
			// Create a new point with the lat and long from click event
			const point = new google.maps.LatLng(data.latitude, data.longitude);
			pointArray.push(point);
		})
		.catch((error) => {
			console.log(error)
		});

}

function getPoints() {

	let dataPoints = []

	fetch('https://yowmxwf75c.execute-api.us-east-1.amazonaws.com/prod/rat-locations', {
		method: 'GET',
		headers: {
			'Content-Type': "application/json",
			'Access-Control-Allow-Origin': "*"
		}
	})
		.then(response => {
			if (response.status != 200) {
				throw new Error('unable to featch data points');
			}
			console.log("successfully fetched data points")
			return response.json()
		})
		.then(data => {
			for (let i in data) {
				let newPoint = new google.maps.LatLng(data[i]["latitude"], data[i]["longitude"])
				dataPoints.push(newPoint)
			}
			pointArray = new google.maps.MVCArray(dataPoints);
			heatmap = new google.maps.visualization.HeatmapLayer({
				data: pointArray,
				map: map			
			});
			heatmap.set("radius", 40)
			heatmap.set("opacity", .9)
		})
		.catch((error) => {
			console.log(error)
		});
	
	return dataPoints
}

window.initMap = initMap;
