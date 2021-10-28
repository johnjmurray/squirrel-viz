// With help from https://github.com/kaczmarj/covid19vis

//const squirrelDataURL = `https://data.cityofnewyork.us/resource/vfnx-vebw.geojson`;
const squirrelDataURL = `https://data.cityofnewyork.us/resource/vfnx-vebw.csv`;
const centralParkJSON = 'centralPark.json';



Promise.all([d3.json(centralParkJSON),d3.csv(squirrelDataURL)])
    .then(result => {
        let centralPark = result[0],squirrelData = result[1];
		// Reshape from wide to long format.
		let squirrelDataLong = [];
        let goodCols = ["PrimaryFurColor", "SquirrelID", "Lat", "Long"]
        squirrelData.forEach(row => {
			squirrelDataLong.push({
				"PrimaryFurColor": row["primary_fur_color"],
				"SquirrelID": row["unique_squirrel_id"],
				"Lat": row["y"],
				"Long": row["x"],
			})
        })
		console.log(squirrelDataLong[217])

        const width = 2000;	
        const height = 1000;
        
		let svg = d3.select("div.map-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .classed("svg-content", true);
		//https://stackoverflow.com/questions/28116230/displaying-ny-state-with-counties-map-via-shp-and-topojson
        let projection = d3.geoMercator().center([-73.968285,40.785091]).scale(500000).translate([width/2, height/2]);	
        let path = d3.geoPath().projection(projection);
        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.append("g")
            .selectAll("path")
            .data(centralPark.geometries)
            .enter()
            .append("path")
            .attr("d", path)
			.attr("class","park-arc")

		let colorMap = {"Black":"#000000","Cinnamon":"#AA5518","Gray":"#808080","":"6aodad"}
		
		svg
			.selectAll("caseCircles")
			.data(squirrelDataLong)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("cx", d => projection([d.Long, d.Lat])[0])
			.attr("cy", d => projection([d.Long, d.Lat])[1])
			.attr("r","1")
			.style("fill", r => colorMap[r["PrimaryFurColor"]])

    })
    .catch(err => console.error(err));
