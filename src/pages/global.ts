import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVars {
	instructions: any;
	arduinoInfo: any;
	constructor(){
		this.instructions = "";
		this.arduinoInfo = [];
		//this.arduinoInfo = [{row: 0, col: 0,type: "fly",servo: -45,linear: 45,psi: 200},{row: 0,col: 1,type: "ground",servo: -44,linear: -15,psi: 200}];
	}

	setInstructions(value){
		console.log("set instructions: " + value);
		this.instructions = value;
	}

	setArduinoInfo(){
		console.log("getting arduinoInfo");
		var psiCount = 200;
		var servoCount = -45;
		var linearCountBase = 45;
		var position = "left";
		var direction = "left";
		var depth = "deep";
			for(var i=0; i < 10; i++){
  			psiCount--;
  			linearCountBase--;
	  			for(var j=0; j < 14; j++){

						//left, center, right
						if(i < 6){
							if(j < 3){
								position = "Left"
							}
							else if(j < 7){
								position = "Center"
							}
							else{
								position = "Right"
							}
						}

						else if(i < 8){
							if(j < 3){
								position = "3rd"
							}
							else if(j < 5){
								position = "SS"
							}
							else if(j < 7){
								position = "2nd"
							}
							else{
								position = "1st"
							}
						}

						else {
							if(j < 3){
								position = "Catch"
							}
							else if(j < 7){
								position = "Pitch"
							}
							else{
								position = "Catch"
							}
						}

	  				servoCount++;
						//still need to add direction & depth
	  				this.arduinoInfo.push({row: i, col: j, type: "Fly Ball", position: position, servo: servoCount, linear: linearCountBase + 10, psi: psiCount});
	  				this.arduinoInfo.push({row: i, col: j, type: "Ground Ball", position: position, servo: servoCount, linear: linearCountBase - 10, psi: psiCount});
	  				this.arduinoInfo.push({row: i, col: j, type: "Line Drive", position: position, servo: servoCount, linear:linearCountBase, psi: psiCount});
	  				console.log("saving: " + i + ", " + j);
	  			}
  		}

	}

	getInstructions(){
		return this.instructions;
	}
	getArduinoInfo(row: any, col: any, type: any){
		console.log("getting arduino info for instruction list");
		var result = [];
		for(var i = 0; i < this.arduinoInfo.length; i++){
			if(this.arduinoInfo[i].row === row && this.arduinoInfo[i].col === col && this.arduinoInfo[i].type === type){
				console.log("position in global: " + this.arduinoInfo[i].position);
				result.push({row: row, col: col, type: type, servo: this.arduinoInfo[i].servo, linear: this.arduinoInfo[i].linear, psi: this.arduinoInfo[i].psi, position: this.arduinoInfo[i].position});
			}
		}
		return result;
	}
}
