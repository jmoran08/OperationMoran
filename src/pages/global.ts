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
			for(var i=0; i < 10; i++){
  			psiCount--;
  			linearCountBase--;
	  			for(var j=0; j < 14; j++){
	  				servoCount++;
	  				this.arduinoInfo.push({row: i, col: j, type: "fly", servo: servoCount, linear: linearCountBase + 10, psi: psiCount});
	  				this.arduinoInfo.push({row: i, col: j, type: "ground", servo: servoCount, linear: linearCountBase - 10, psi: psiCount});
	  				this.arduinoInfo.push({row: i, col: j, type: "line", servo: servoCount, linear:linearCountBase, psi: psiCount});
	  				console.log("saving: " + i + ", " + j);
	  			}
  		}

	}

	getInstructions(){
		return this.instructions;
	}
	getArduinoInfo(row: any, col: any, type: any){
		var result = {};
		for(var i = 0; i < this.arduinoInfo.length; i++){
			if(this.arduinoInfo[i].row === row && this.arduinoInfo[i].col === col && this.arduinoInfo[i].type === type){
				result = {row: row, col: col, type: type, servo: this.arduinoInfo[i].servo, linear: this.arduinoInfo[i].linear, psi: this.arduinoInfo[i].psi};
			}
		}
		return result;
	}
}
