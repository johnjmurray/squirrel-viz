// With help from https://github.com/kaczmarj/covid19vis

//const squirrelDataURL = `https://data.cityofnewyork.us/resource/vfnx-vebw.geojson`;
const squirrelDataURL = `https://data.cityofnewyork.us/resource/vfnx-vebw.csv`;
const nyJSON = "ny.geo.json"

Promise.all([d3.json(nyJSON), d3.csv(squirrelDataURL)])
    .then(result => {
        let countries = result[0],
            squirrelData = result[1];


        // Reshape from wide to long format.
        let goodCols = ["Country/Region", "Province/State", "Lat", "Long"]
        squirrelData.forEach(row => {
            for (let colname in row) {
                if (!goodCols.includes(colname)) {
                    squirrelData.push({
                        "PrimaryFurColor": row["primary_fur_color"],
                        "SquirrelID": row["unique_squirrel_id"],
                        "Lat": row["y"],
                        "Long": row["x"],
                    })
                }
            }
        })


        // let casesOnly = squirrelData.map(d => d.Cases);

        const width = 900;
        const height = 500;
        let svg = d3.select("div.map-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .classed("svg-content", true);

        let projection = d3.geoNaturalEarth1().translate([width / 2, height / 2]);
        let path = d3.geoPath().projection(projection);



        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.append("g")
            .selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country-state");

        const factor = 0.5;

        svg
            .selectAll("caseCircles")
            .data(squirrelData)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", d => projection([d.Long, d.Lat])[0])
            .attr("cy", d => projection([d.Long, d.Lat])[1])
            .attr("r", d => Math.sqrt(d[latestDate]) * factor)

        d3.select(".date-output")
            .text(latestDate)


    })
    .catch(err => console.error(err));
