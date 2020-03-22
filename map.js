// With help from https://github.com/kaczmarj/covid19vis

//const squirrelDataURL = `https://data.cityofnewyork.us/resource/vfnx-vebw.geojson`;
const squirrelDataURL = `https://data.cityofnewyork.us/resource/vfnx-vebw.csv`;
const centralParkJSON = 'centralPark.json';



Promise.all([d3.json(centralParkJSON),d3.csv(squirrelDataURL)])
    .then(result => {
        let centralPark = result[0],squirrelData = result[1]
		// Reshape from wide to long format.
		let squirrelDataLong = [];
        let goodCols = ["PrimaryFurColor", "SquirrelID", "Lat", "Long"]
        squirrelData.forEach(row => {
            for (let colname in row) {
                if (!goodCols.includes(colname)) {
                    squirrelDataLong.push({
                        "PrimaryFurColor": row["primary_fur_color"],
                        "SquirrelID": row["unique_squirrel_id"],
                        "Lat": row["y"],
                        "Long": row["x"],
                    })
                }
            }
        })
		console.log(squirrelDataLong[217])

        const width = 1200;	
        const height = 700;
        
		let svg = d3.select("div.map-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .classed("svg-content", true);
		//https://stackoverflow.com/questions/28116230/displaying-ny-state-with-counties-map-via-shp-and-topojson
        let projection = d3.geoMercator().center([-73.968285,40.785091]).scale(1000000).translate([width/2, height/2]);	
        let path = d3.geoPath().projection(projection);
		let uniqueSquirrels = d3.map(squirrelDataLong, d => d.SquirrelID).keys()
        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.append("g")
            .selectAll("path")
            .data(centralPark.geometries)
            .enter()
            .append("path")
            .attr("d", path)


		svg
			.selectAll("caseCircles")
			.data(squirrelDataLong)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("cx", d => projection([d.Long, d.Lat])[0])
			.attr("cy", d => projection([d.Long, d.Lat])[1])
			.attr("r","1")

    })
    .catch(err => console.error(err));
