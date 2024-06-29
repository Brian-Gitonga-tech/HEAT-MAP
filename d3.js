//fetching data
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
const req = new XMLHttpRequest;
req.open("GET", url, true)
req.send()
req.onload = () => {
    const json = JSON.parse(req.responseText)
    const dataset = json["monthlyVariance"]

    const w = 1200
    const h = 650
    const p = 80


    let minimumYear = d3.min(dataset, (d) => {
        return new Date(d["year"])
     });

     let maximiumYear = d3.max(dataset, (d) => {
        return new Date(d["year"])
     })

     let numOfYears = maximiumYear - minimumYear

    const xScale = d3.scaleLinear()
                     .domain([minimumYear, maximiumYear])                     
                     .range([p, w - p])
    const yScale = d3.scaleTime()
                     .domain([new Date(0,0,0,0,0,0,0), new Date(0,12,0,0,0,0,0)])
                     .range([p, h - p])
    
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B"))
    let tooltip = d3.select('#tooltip')
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("padding", p)
                  .attr("class", "svg")
                  .style("background-color", "white")
          svg.selectAll("rect")
             .data(dataset)
             .enter()
             .append("rect")
             .attr("class", "cell")
             .attr("data-month", (d) => {
                return d["month"] -1
             })
             .attr("data-temp", (d) => {
                return d["variance"]
             })
             .attr("data-year", (d) => {
                return d["year"]
             })
             .attr("height", (h - 2*p)/12)
             .attr("fill", (d) => {

               let variance = d["variance"]

                if(variance <= -2) {
                    return "rgb(69, 117, 180)"
                } else if (variance <= -1) {
                    return 'rgb(116, 173, 209)'
                }else if (variance <= 0) {
                    return "rgb(255, 255, 191)"
                } else if (variance <= 2) {
                    return 'rgb(253, 174, 97)'
                }  else if (variance <= 4) {
                    return "rgb(244, 109, 67)"
                }else {
                    return "rgb(215, 48, 39)"
                }
             })
             .attr("y", (d) => {
              return yScale(new Date(0, d["month"] -1, 0, 0, 0, 0, 0))
             })
             .attr("width", (d) => {
              return (w - 2*p)/numOfYears
             })
             .attr("x", (d) => {
                return xScale(d["year"])
             })
             .on('mouseover', (d) => {
               tooltip.transition()
                      .style("visibility", "visible")
                  
                  let months = [
                     'January',
                     'February',
                     'March',
                     'April',
                     'May',
                     'June',
                     'July',
                     'August',
                     'September',
                     'October',
                     'November',
                     'December'
                  ]
            tooltip.text(d["year"])
             })
             .on("mouseout", (d) => {
               tooltip.transition()
                      .style("visibility", "hidden")
             })

          svg.append("g")
             .attr("id", "x-axis")
             .attr("transform", "translate(0, " + (h - p) + ")")
             .call(xAxis)

          svg.append("g")
             .attr("id", "y-axis")
             .attr("transform", "translate("+ p +", 0)")
             .call(yAxis)
         
}