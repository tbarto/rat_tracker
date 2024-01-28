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
			console.log("new data point: ")
			console.log(data.latitude)
			console.log(data.longitude)
			// Create a new point with the lat and long from click event
			const point = new google.maps.LatLng(data.latitude, data.longitude)
			// Add the new point to the heatmap
			heatmap.data.push(point)
		})
		.catch((error) => {
			console.log(error)
		});

}

function toggleHeatmap() {
	heatmap.setMap(heatmap.getMap() ? null : map);
}

function getPoints() {
	let dataPoints = []

	fetch('https://yowmxwf75c.execute-api.us-east-1.amazonaws.com/prod/rat-locations', {
		method: 'GET'
	})
		.then(response => {
			if (response.status != 200) {
				throw new Error('unable to featch data points');
			}
			console.log("successfully fetched data points")
			return response.json()
		})
		.then(data => {
			console.log(data)
			for (let i in data) {
				let newPoint = new google.maps.LatLng(data[i]["latitude"], data[i]["longitude"])
				dataPoints.push(newPoint)
			}
		})
		.catch((error) => {
			console.log(error)
		});

	return dataPoints
}

window.initMap = initMap;
