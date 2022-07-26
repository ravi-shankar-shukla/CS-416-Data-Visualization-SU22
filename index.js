function init(){
	
	first();
}

function first(){

var lagend=40;
// set the dimensions and margins of the graph
var margin = {top: 5, right: 13, bottom: 50, left: 40},
    width = 600 - margin.left - margin.right-lagend,
    height = 245 - margin.top - margin.bottom;

// append the svgcases object to the body of the page
var svgcases = d3.select("#cases_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var pageButton=60;
var xvarpro = d3.scaleBand()
    .rangeRound([0, width-lagend])
    .paddingInner(0.05)
    .align(0.1);

var variantwho		= ["Delta", 	"Omicron", 		"Omicron", 	"Omicron", 	"Omicron",		"Omicron",	"Omicron",	"Other"];
var variantfamily		= ["All", "Other", "Delta", 	"Omicron"];

var variantcodeonlylegend = ["Other",	"B16172",		"B11529", 		"BA11", 	"BA2", 		"BA2121", 		"BA4", 		"BA5",];
var varianttextonlylegend = ["Other",	"B.1.617.2",	"B.1.1.529",  	"BA.1.1", 	"BA.2", 	"BA.2.12.1", 	"BA.4", 	"BA.5",];

var allGroup= ["All", "Other", "B16172",  "B11529", "BA11", "BA2", "BA2121", "BA4", "BA5"];
var allGroupText= ["All", "Other", "Delta - B.1.617.2",  "Omicron - B.1.1.529", "Omicron - BA.1.1", "Omicron - BA.2", "Omicron - BA.2.12.1", "Omicron - BA.4", "Omicron - BA.5"];
var allGroupColor= ["white", "yellow", "red", "blue", "purple", "orange", "pink", "green", "brown"]
	
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
	.range(["yellow", "red", "blue", "purple", "orange", "pink", "green", "brown"]);
  
var xAxis = d3.axisBottom(xvarpro)

// append the svgvariant object to the body of the page
var svgvariant = d3.select("#variant_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//global variable
var includeexcludeglb="inc";
var selectedGroupglb="All";
  
d3.queue()
.defer(d3.csv, "https://raw.githubusercontent.com/ravi-shankar-shukla/CS-416-Data-Visualization-SU22/main/SARS-CoV-2_CasesDeaths.csv")
.defer(d3.csv, "https://raw.githubusercontent.com/ravi-shankar-shukla/CS-416-Data-Visualization-SU22/main/SARS-CoV-2_Variant_Proportions.csv")
.await(function(error, casesdeath, varprop) {
    if (error) {
        console.error('Error : ' + error);
    } // await function else start
    else {
		const casesdeathorginal=casesdeath;
		
		/*Variant Bar Starts*/
		xvarpro.domain(varprop.map(function(d) {return new Date(d.WeekEndDate); }));
		y.domain([0, 1]).nice();
		z.domain(varianttextonlylegend);
		var div = d3.select("body").append("div")
			.attr("class", "tooltip-donut")
			.style("opacity", 0);
			 
		svgvariant
			.append("g")
			.selectAll("g")
			.data(d3.stack().keys(varianttextonlylegend)(varprop))
			.enter().append("g")
				.classed("bar-group", true)
				.attr("fill", function(d) { return z(d.key); })
				.attr("id", "variantbar")
				.attr("value", function(d, i) {return variantcodeonlylegend[i];})
					.on('mouseover', function (d, i) {
						d3.select(this).transition()
						.duration('50')
						.attr('opacity', '.35');
					   
						//Makes the new div appear on hover:
						div.transition()
							.duration(50)
							.style("opacity", 1);
							 })
					.on('mouseout', function (d, i) {
						d3.select(this).transition()
						.duration('50')
						.attr('opacity', '1');
					
					//Makes the new div disappear:
						div.transition()
							.duration('50')
							.style("opacity", 0);
							})
				.selectAll("rect")
				.data(function(d) { return d; }, d => d.data.WeekEndDate)
				.enter().append("rect")
					.classed("bar", true)
				.attr("x", function(d) { return xvarpro(new Date(d.data.WeekEndDate)); })
				.attr("y", function(d) { return y(d[1]); })
				.attr("height", function(d) { return y(d[0]) - y(d[1]); })
				.attr("width", xvarpro.bandwidth());

		// Add X axis variant WeekEndDate
		var xvarprop = d3.scaleTime()
			.domain(d3.extent(varprop, function(d) {return new Date(d.WeekEndDate); }))
			.range([ 0, width - margin.left -lagend]);
		
		// Subvariant axis
		svgvariant.append("g")
			.attr("class", "xvarprop")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xvarprop).tickFormat(d3.timeFormat("%Y-%b")))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("transform", "rotate(-65)");

		svgvariant.append("g")
			.attr("class", "axis y")
			.call(d3.axisLeft(y).ticks(5, "s"))
			.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop()) + 0.5)
			.attr("text-anchor", "middle")
			.attr("transform", "rotate(-65)");

		var legend = svgvariant.append("g")
			.attr("text-anchor", "end")
			.selectAll("g")
			.data(varianttextonlylegend.slice())
			.enter().append("g")
				.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")"; })
				.attr("id", "barlagend")
				.attr("class", "barlagend")
				.attr("value", function(d, i) {return variantcodeonlylegend[i];})
					.on('mouseover', function (d, i) {
						d3.select(this).transition()
						.duration('50')
						.attr('opacity', '.35');
					   
						//Hover Div
						div.transition()
							.duration(50)
							.style("opacity", 1);
					})
					.on('mouseout', function (d, i) {
						d3.select(this).transition()
					   .duration('50')
					   .attr('opacity', '1');
						//Hover Div
						div.transition()
					   .duration('50')
					   .style("opacity", 0);
					});
				
			 

					
		// Y label
		svgvariant.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(-30,' + height/2 + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text('% of Variant Lineages among infections');
				
		legend.append("rect")
			.attr("x", width - 19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", z);

		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function(d) { return d; })
			.attr("stroke","white");
		/*Variant Bar Ends*/

		/* Variant chart Start*/

		// A color scale: one color for each group
		var myColor = d3.scaleOrdinal()
			.domain(allGroup)
			.range(["white", "yellow", "red", "blue", "purple", "orange", "pink", "green", "brown"]);
			
		// add the options to the button
		d3.select("#selectButton")
			.selectAll('myOptions')
			.data(allGroup)
			.enter()
				.append('option')
				.text(function (d,i) { return allGroupText[i]; })
				.attr("value", function (d) { return d; })
		
		//add select option 
		d3.select("#selectFamilyButton")
			.selectAll('myOptions')
			.data(variantfamily)
			.enter()
				.append('option')
				.text(function (d,i) { return variantfamily[i]; })
				.attr("value", function (d) { return d; })

		// When the button is changed, run the updateChart function
		d3.select("#includeexclude").on("change", function(d) {
			// recover the option that has been chosen
			includeexcludeglb = d3.select(this).property("value");
			
			// run the updateFamily function with this selected family
			casesdeath = casesdeathorginal.filter(function(d){return d.Variant==selectedGroupglb});
			update( includeexcludeglb, selectedGroupglb)
			})
			
		// Add X axis Cases WeekEndDate
		var xcasedeath = d3.scaleTime()
			.domain(d3.extent(casesdeath, function(d) {return new Date(d.WeekEndDate); }))
			.range([ 0, width - margin.left  -lagend ]);
			
		svgcases.append("g")
			.attr("class", "xcasedeath")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xcasedeath).tickFormat(d3.timeFormat("%Y-%b")))
				.selectAll("text") 
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");
					

		// Add Cases Y axis
		var ycases = d3.scaleLinear()
			.domain([0, d3.max(casesdeath.filter(function(d){return d.Variant==allGroup[0] && d.CasesDeath=="Cases"}), function(d) { return +d.Number; })])
			.range([ height, 0 ]);

		var yaxiscases=svgcases.append("g")
			.call(d3.axisLeft(ycases).ticks(5, "s"))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("transform", "rotate(-65)");
				
		svgcases.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(-30,' + height/2 + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text('Cases');
			  
		
		// Add Deaths Y axis
		var ydeaths = d3.scaleLinear()
			.domain([0, d3.max(casesdeath.filter(function(d){return d.Variant==allGroup[0] && d.CasesDeath=="Deaths"}), function(d) { return +d.Number; })])
			.range([ height, 0 ]);

		var yaxisdeaths=svgcases.append("g")
			.attr("transform", "translate(" + parseInt(width-margin.right-margin.left/2-lagend-5) + ",0)")
			.call(d3.axisRight(ydeaths).ticks(5, "s"))
				.selectAll("text") 
				.style("text-anchor", "end")
				.attr("dx", "0.8em");

		svgcases.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate('+parseInt(width-margin.right/2-lagend)+',' + height/2 + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text('Deaths');

	
		// First variant group Cases
		var linecases = svgcases
			.append('g')
			.append("path")
			.datum(casesdeath.filter(function(d){return d.Variant==allGroup[0] && d.CasesDeath=="Cases"}))
			.attr("d", d3.line()
				.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
				.y(function(d) { return ycases(+d.Number) })
				)
			.attr("stroke", function(d){return myColor(d.Variant) })
			.style("stroke-width", 4)
			.style("fill", "none");
				
						
		// First variant group Deaths
		var linedeaths = svgcases
			.append('g')
			.append("path")
			.datum(casesdeath.filter(function(d){return d.Variant==allGroup[0] && d.CasesDeath=="Deaths"}))
			.attr("d", d3.line()
				.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
				.y(function(d) { return ydeaths(+d.Number) })
				)
			.attr("stroke", function(d){ return myColor(d.Variant) })
			.style("stroke-width", 4)
			.style("fill", "none")
			.style("stroke-dasharray", ("3, 3"));
				
		// All variant group Cases
		var alllinecases = svgcases
			.append('g')
			.append("path")
			.datum(casesdeath.filter(function(d){return d.Variant==allGroup[0] && d.CasesDeath=="Cases"}))
			.attr("d", d3.line()
				.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
				.y(function(d) { return ycases(+d.Number) })
				)
			.attr("stroke", function(d){ return myColor(d.Variant) })
			.style("stroke-width", 4)
			.style("fill", "none");

			
		// all variant group Deaths
		var alllinedeaths = svgcases
			.append('g')
			.append("path")
			.datum(casesdeath.filter(function(d){return d.Variant==allGroup[0] && d.CasesDeath=="Deaths"}))
			.attr("class", "alldeath")
			.attr("d", d3.line()
				.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
				.y(function(d) { return ydeaths(+d.Number) })
				)
			.attr("stroke", function(d){ return myColor(d.Variant) })
			.style("stroke-width", 4)
			.style("fill", "none")
			.style("stroke-dasharray", ("3, 3"));

		/* Variant Chart Ends */
				
		/*Annotation Start*/
		const annotations = [{
							note: { label: "Delta supersede Other. Other:45%; Delta: 54%", bgPadding: 20,color: ["#69b3a2"], wrap: 40},
							subject: {
								color: ["#69b3a2"],
								y1: margin.top,
								y2: height
									},
								color: ["#69b3a2"],
								y: margin.top,
								data: { x: "6/26/2021"},
								color: ["#69b3a2"],
								  }, {
							note: { label: "Omicron supersede Delta. Delta: 26%; Omicron: 73%",	bgPadding: 20,color: ["#69b3a2"], wrap: 40},
							subject: {
								y1: margin.top,
								y2: height
									},
								y: margin.top,
								data: { x: "12/25/2021"}
								}, {
							connector: {
								end: "dot",
								type: "dash",
								lineType : "vertical",
								endScale: 2
									},
							color: ["#69b3a2"],
							y: margin.top-5,
							data: { x: "6/26/2021"}
								},{
							connector: {
								end: "dot",
								type: "dash",
								lineType : "vertical",
								endScale: 2
								},
							color: ["#69b3a2"],
							y: margin.top-5,
							data: { x: "12/25/2021"}
						}
					]
					
		const type = d3.annotationCustomType(
			d3.annotationXYThreshold, 
				{"note":{
					"lineType":"none",
					"orientation": "right",
					"align":"middle",
					"stroke-dasharray": ("3, 3")
					}
				}
			);

		const makeAnnotations = d3.annotation()
			.type(type)
			.accessors({
				x: function(d){ return xcasedeath(new Date(d.x))}
			})
			.annotations(annotations)
			//.textWrap(30);

		svgcases.append("g")
			.attr("class", "annotation-group")
			.call(makeAnnotations);
		/*Annotation End*/
				
				
		/*Anchor tab Starts*/
		const firstvaraint=0;
		const lastvaraint= allGroup.length;
		var currentvaraint=0;

		//next
		const nextbtn=document.getElementById('next');
		nextbtn.addEventListener('click',()=>{
		currentvaraint++;
		var varianttag=document.getElementById(allGroup[currentvaraint]);
		if(currentvaraint==lastvaraint-1){
			document.getElementById("next").disabled = true;
			document.getElementById("prev").disabled = false;
		}
		else{
			document.getElementById("next").disabled = false;
			document.getElementById("prev").disabled = false;
		}
		if(currentvaraint>=lastvaraint){
			currentvaraint=7;
		}
		
		var a = document.getElementsByTagName('a');
		for (var idx= 0; idx < 9; ++idx){
			a[idx].className="litop";
		}
		varianttag.className = "active";
		selectedGroupglb=allGroup[currentvaraint]
		update(includeexcludeglb,allGroup[currentvaraint]);
		});

		//next
		const prevbtn=document.getElementById('prev');
		prevbtn.addEventListener('click',()=>{
		currentvaraint--;
		var varianttag=document.getElementById(allGroup[currentvaraint]);
		if(currentvaraint==firstvaraint){
			document.getElementById("prev").disabled = true;
			document.getElementById("next").disabled = false;
		}
		else{
			document.getElementById("prev").disabled = false;
			document.getElementById("next").disabled = false;
		}
		if(currentvaraint< firstvaraint){
			currentvaraint=0;
		}
		
		var a = document.getElementsByTagName('a');
		for (var idx= 0; idx < 9; ++idx){
			a[idx].className="litop";
		}
		
		varianttag.className = "active"
		selectedGroupglb=allGroup[currentvaraint];
		update(includeexcludeglb,allGroup[currentvaraint]);
		});
		/*Anchor tab ends */
		

		// Update chart
		function update(incexc, selectedGroup) {
			casesdeath=casesdeathorginal;
			if(incexc=="inc"){
				alllinecases
					.attr("stroke", "white")
					.style("stroke-width", 4);
						
				alllinedeaths
					.attr("stroke", "white")
					.style("stroke-width", 4);
					
				var dataCaseFilter = casesdeath.filter(function(d){return d.Variant==selectedGroup && d.CasesDeath=="Cases"});
				var dataDeathFilter = casesdeath.filter(function(d){return d.Variant==selectedGroup && d.CasesDeath=="Deaths"})
						
				// Add Cases Y axis
				ycases = d3.scaleLinear()
					.domain([0, d3.max(casesdeath.filter(function(d){return d.Variant=="All" && d.CasesDeath=="Cases"}), function(d) { return +d.Number; })])
					.range([ height, 0 ]);

				yaxiscases.remove();
				yaxiscases=svgcases.append("g")
					.call(d3.axisLeft(ycases).ticks(5, "s"))
						.selectAll("text")
						.style("text-anchor", "end")
						.attr("transform", "rotate(-65)");
						
				// Add Deaths Y axis
				ydeaths = d3.scaleLinear()
					.domain([0, d3.max(casesdeath.filter(function(d){return d.Variant=="All" && d.CasesDeath=="Deaths"}), function(d) { return +d.Number; })])
					.range([ height, 0 ]);

				yaxisdeaths.remove();
						
				yaxisdeaths=svgcases.append("g")
					.attr("transform", "translate(" + parseInt(width-margin.right-margin.left/2-lagend-5) + ",0)")
					.call(d3.axisRight(ydeaths).ticks(5, "s"))
						.selectAll("text")
						.style("text-anchor", "end")
						.attr("dx", "0.8em");
						
				// all variant group Deaths
				alllinedeaths
					.append("path")
					.datum(casesdeath.filter(function(d){return d.Variant=="All" && d.CasesDeath=="Deaths"}))
							.attr("d", d3.line()
								.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
								.y(function(d) { return ydeaths(+d.Number) })
								)
							.attr("stroke", function(d){ return myColor(d.Variant) })
							.style("stroke-width", 4)
							.style("fill", "none")
							.style("stroke-dasharray", ("3, 3"));
				
				// Give these new data to update cases line
				linecases
					.datum(dataCaseFilter)
					.transition()
					.duration(1000)
					.attr("d", d3.line()
						.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
						.y(function(d) { return ycases(+d.Number) })
						 )
					.attr("stroke", function(d){ return myColor(selectedGroup) })
					.style("stroke-width", 4)
					.style("fill", "none");
						
				// Give these new data to update cases line
				linedeaths
					.datum(dataDeathFilter)
					.transition()
					.duration(1000)
					.attr("d", d3.line()
						.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
						.y(function(d) { return ydeaths(+d.Number) })
						)
					.attr("stroke", function(d){ return myColor(selectedGroup) })
					.style("stroke-width", 4)
					.style("fill", "none");
					
				}
				else if(incexc=="exc"){
					alllinecases
						.attr("stroke", "black")
						.style("stroke-width", 0);
						
					alllinedeaths
						.attr("stroke", "black")
						.style("stroke-width", 0);
					
					yaxiscases.attr("stroke", "black");
						
				var dataCaseFilter = casesdeath.filter(function(d){return d.Variant==selectedGroup && d.CasesDeath=="Cases"});
				var dataDeathFilter = casesdeath.filter(function(d){return d.Variant==selectedGroup && d.CasesDeath=="Deaths"});
				
				// Add Cases Y axis
				ycases = d3.scaleLinear()
					.domain([0, d3.max(casesdeath.filter(function(d){return d.Variant==selectedGroup && d.CasesDeath=="Cases"}), function(d) {return +d.Number; })])
					.range([ height, 0 ]);
					
				yaxiscases.remove();
				yaxiscases=svgcases.append("g")
					.call(d3.axisLeft(ycases).ticks(5, "s"))
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("transform", "rotate(-65)");
						  
				// Add Deaths Y axis
				ydeaths = d3.scaleLinear()
					.domain([0, d3.max(casesdeath.filter(function(d){return d.Variant==selectedGroup && d.CasesDeath=="Deaths"}), function(d) { return +d.Number; })])
					.range([ height, 0 ]);
					
				yaxisdeaths.remove();
				yaxisdeaths=svgcases.append("g")
					.attr("transform", "translate(" + parseInt(width-margin.right-margin.left/2-lagend-5) + ",0)")
					.call(d3.axisRight(ydeaths).ticks(5, "s"))
						.selectAll("text") 
						.style("text-anchor", "end")
						.attr("dx", "0.8em");
							
				// First variant group Cases
				linecases
					.datum(dataCaseFilter)
					.transition()
					.duration(1000)
					.attr("d", d3.line()
						.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
						.y(function(d) { return ycases(+d.Number) })
						)
					.attr("stroke", function(d){return myColor(selectedGroup) })
					.style("stroke-width", 4)
					.style("fill", "none");
													
				// First variant group Deaths
				linedeaths
					.datum(dataDeathFilter)
					.transition()
					.duration(1000)
					.attr("d", d3.line()
						.x(function(d) { return xcasedeath(new Date(d.WeekEndDate)) })
						.y(function(d) { return ydeaths(+d.Number) })
						)
					.attr("stroke", function(d){ return myColor(selectedGroup) })
					.style("stroke-width", 4)
					.style("fill", "none")
					.style("stroke-dasharray", ("3, 3"));
				}
					
			
				  
				// Get all elements with class="variantdivtop" and hide them
			  tabcontenttop = document.getElementsByClassName("variantdivtop");
			  for (i = 0; i < tabcontenttop.length; i++) {
				tabcontenttop[i].style.display = "none";
			  }
			  // Show the current tab, and add an "active" class to the button that opened the tab
			  document.getElementById("top"+selectedGroup).style.display = "block";
			  
			  // Get all elements with class="variantdivbottom" and hide them
			  tabcontentbottom = document.getElementsByClassName("variantdivbottom");
			  for (i = 0; i < tabcontentbottom.length; i++) {
				tabcontentbottom[i].style.display = "none";
			  }

			  document.getElementById("top"+selectedGroup).style.display = "block";
			    
			}
			
			// When the lagend is clicked, run the updateChart function
			d3.selectAll("#barlagend").on("click", function(d) {
				selectedGroupglb=d3.select(this).attr("value")
				update(includeexcludeglb,selectedGroupglb)
			})
			
			// When the bar plot is clicked, run the updateChart function
			d3.selectAll("#variantbar").on("click", function(d) {
				selectedGroupglb=d3.select(this).attr("value")
				update(includeexcludeglb,selectedGroupglb)
			})
			



    }
	// await function else end
});




}

