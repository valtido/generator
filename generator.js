module.exports = function(schema,num,undefined){
	var mongoose = require('mongoose');

	function randomDate(start, end) {
		if(start == undefined) start = new Date(1970)
		if(end == undefined) end = new Date()
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}
	function randomIntFromInterval(min,max)
	{
			return Math.floor(Math.random()*(max-min+1)+min);
	}
	function range(lowEnd,highEnd){
		var arr = [],
		c = highEnd - lowEnd + 1;
		while ( c-- ) {
		 arr[c] = highEnd--
		}
		return arr;
	}
	var gen = {
		objectid: function(){
			return mongoose.Types.ObjectId()
		},
		date: function(){
			return randomDate().toString();
		},
		boolean: function(){
			return this.bool()
		},
		bool: function(){
			return (Math.random() < 0.5)
		},
		number: function(){
			return Number(Math.random().toString().split(".")[1])
		},
		string: function(){
			return Math.random().toString(36).replace(/[^a-z]+/g, '') 
		},
		array: function(){
			return new Array(num)
		}
	}
	;

	var get = function(type){
		// console.log(type.name)
		var s = "";
		if(type.name != undefined ) {
			s = type.name
		}else if(type.type != undefined && type.type.name){
			s = type.type.name
		}else if(type.length == 1 && typeof type == "object" && type[0].tree!=undefined){
			s = "schema"
			return init(type[0].tree)
		}else if(typeof type=="object", type instanceof Object == true){
			return init_object(type,0)
		}else{
			console.log(type.length, typeof type, type instanceof Object)
		}
		if(s!=undefined) s = s.toString().toLowerCase()
		// console.log(s)
		if(gen[s] != undefined) return gen[s]();

		return "type_not_found: "+ type
	}

	var exc = ['_id','id','__v'];

	function init_object (schema){
		var arr = {};
		for(prop in schema){
			if(exc.indexOf(prop) !== -1) continue;
			var type = schema[prop];
			arr[prop] = get(type);
		}//end loop schema
		return arr
	}

	function init (schema,num){
		var arr = [];
		var i = 0;
		num = num || randomIntFromInterval(0,10) 

		for (el in range(0, num)){
			arr[i] = {};
			for(prop in schema){
				if(exc.indexOf(prop) !== -1) continue;
				var type = schema[prop];

				if(type instanceof Array) 	arr[i][prop] = init(type);
				else 												arr[i][prop] = get(type, num);
			}//end loop schema
			
			i++;//increment by 1

		}//end range
		return arr;
	}
	return init(schema,num)//start init
}