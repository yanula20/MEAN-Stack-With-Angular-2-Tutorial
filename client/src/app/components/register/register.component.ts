import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

form: FormGroup;

constructor( 
  	private formBuilder: FormBuilder
  ) { 
  	this.createForm();
  }


createForm(){

 	this.form = this.formBuilder.group({

 		email: ['', Validators.compose([ 
 			Validators.required,
 			Validators.minLength(5),
 			Validators.maxLength(30),
 			this.validateEmail
 		])],
 		username: ['', Validators.compose([ 
 			Validators.required,
 			Validators.minLength(5),
 			Validators.maxLength(15),
 			this.validateUsername
 		])],
 		password: ['', Validators.compose([ 
 			Validators.required,
 			Validators.minLength(8),
 			Validators.maxLength(35),
 			this.validatePassword
 		])],
 		confirm: ['', Validators.required]
 	}, { validator: this.matchingPasswords ('password', 'confirm')}) 
}

matchingPasswords (password, confirm){
	return (group: FormGroup) => {
		if (group.controls[password].value === group.controls[confirm].value){
		 return null;
		} else {
			return { 'matchingPasswords': true}
		}
	}
}

validateEmail(controls){
	var regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
    	return null; //passes, no errors
    } else {
    	return {validateEmail: true}//error, show error <li>
    }
}


validateUsername(controls){
	var regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
    	return null; //passes, no errors
    } else {
    	return {validateUsername: true}//error, show error <li>
    }
}

validatePassword(controls){
 	var regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if(regExp.test(controls.value)){
    	return null; //passes, no errors
    } else {
    	return { validatePassword: true}
    }
}
onRegisterSubmit(){

	console.log('Form Submitted.');
}

ngOnInit() {
  }

}
