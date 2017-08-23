	const readline = require('readline');
	const fs = require('fs');
	let arr;
	let year;
	let type;
	let description;
	//intializing the arrays with 0 
	let yearRobbery=new Array(16).fill(0);
	let yearBurglary=new Array(16).fill(0);
	let yearProperty=new Array(16).fill(0);
	let yearVehicle=new Array(16).fill(0);
	let yearStateProp=new Array(16).fill(0);
	let json_obj_lineChart=[];
	let json_obj_barChart=[];
	let json_obj_pieChart=[];
	let yearFromTable=[];
	for(let i=2001;i<=2016;i++)
		yearFromTable.push(i);
	//creating the  new files
	let writeLineChart=fs.createWriteStream('../json/lineChart.json');
	let writeBarChart=fs.createWriteStream('../json/barChart.json');
	let writePieChart=fs.createWriteStream('../json/pieChart.json');
	const rl = readline.createInterface({
		input: fs.createReadStream('../crimedata.csv')
	});
	rl.on('line', (line) => {
		arr=line.split(/,(?![^"]*"(?:(?:[^""]*"){2})*[^"]*$)/);
	if(arr.includes("Year"))
		year=arr.indexOf("Year");
	if(arr.includes("Primary Type"))
		type=arr.indexOf("Primary Type");
	if(arr.includes("Description"))
		description=arr.indexOf("Description");
	if(arr[type]=='ROBBERY')
		yearRobbery[arr[year]-2001]++;
	if(arr[type]=='BURGLARY')
		yearBurglary[arr[year]-2001]++;
	//matching the data against criminal damages
	if(arr[type]=='CRIMINAL DAMAGE'&& arr[description]=='TO PROPERTY')
		yearProperty[arr[year]-2001]++;
	if(arr[type]=='CRIMINAL DAMAGE' && arr[description]=='TO VEHICLE')
		yearVehicle[arr[year]-2001]++;
		if(arr[type]=='CRIMINAL DAMAGE'&& arr[description]=='TO STATE SUP PROP')
			yearStateProp[arr[year]-2001]++;
	});
	rl.on('close',function(){
	// for creating object for counting the robbery and burglary
	for(let i in yearFromTable){
		json_obj_lineChart.push({
			"year":yearFromTable[i],
			"countRobbery": yearRobbery[i],
			"countBurglary": yearBurglary[i]
		});
	}
	//for creating object of criminal type
	for (let j in yearFromTable){
		json_obj_barChart.push({
			"year":yearFromTable[j],
			"countVehcileDamage":yearVehicle[j],
			"countPropertyDamage":yearProperty[j],
			"countStateSupPropDmage":yearStateProp[j]
		});
	}
	//for creating object for robbery for all  years
	for (let k in yearFromTable){
		json_obj_pieChart.push({
			"year":yearFromTable[k],
			"robberyType":yearRobbery[k],
		})

	}
	console.log("all data processed");
	//writing into the file by writestream object
	writeLineChart.write(JSON.stringify(json_obj_lineChart,null,2));
	writeBarChart.write(JSON.stringify(json_obj_barChart,null,2));
	writePieChart.write(JSON.stringify(json_obj_pieChart,null,2));
	});