var distances = require("./distance");

function KMeansPlus (points, k, distance) {
	distance = distance || "euclidean";
	if (typeof distance == "string") {
		this.distance = distances[distance];
	}
	this.clusters = k;
	this.points = points;
	this.centroids = [];
}

KMeansPlus.prototype.getRandomItem = function (array) {
	let random = Math.floor(Math.random() * array.length);
	return array[random];
};

KMeansPlus.prototype.getClosestCentroidDistance = function () {
	return this.points.map(point => {
		let distances = this.centroids.map(centroid => this.distance(point, centroid));
		return Math.min(...distances);
	});
};

KMeansPlus.prototype.getProbabilities = function () {
	let distances = this.getClosestCentroidDistance();
	let distancesSquared = distances.map(a => a * a);
	let distancesSum = distancesSquared.reduce((a, b) => a + b);
	return distancesSquared.map(distance => distance / distancesSum);
};

KMeansPlus.prototype.getNextCentroid = function () {
	let probabilities = this.getProbabilities();
	let cumProbabilities = [];
	let sum = 0;
	probabilities.forEach(weight => {
		sum += weight;
		cumProbabilities.push(sum);
	});
	let random = Math.random();
	for (var i = 0; i < this.points.length; i++) {
		if (cumProbabilities[i] >= random) {
			break;
		}
	}
	return this.points[i];
};

KMeansPlus.prototype.getCentroids = function() {
	this.centroids = [this.getRandomItem(this.points)];
	for (let i = 1; i < this.clusters; i++) {
		this.centroids.push(this.getNextCentroid());
	}
	return this.centroids;
};

module.exports = KMeansPlus;