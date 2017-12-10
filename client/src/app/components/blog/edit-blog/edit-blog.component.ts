import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
	message;
	messageClass;
	processing;
	currentUrl;
	loading = true;
	blog;
  form: FormGroup;
 
  
  constructor(
  	private location: Location,
  	private activatedRoute: ActivatedRoute,
  	private blogService: BlogService,
  	private router: Router,
    private formBuilder: FormBuilder


  	) {
      this.createForm();
    }

    createForm() {
      this.form = this.formBuilder.group({
        title: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          this.validateTitle
        ])],
        body: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000),
          this.validateBody
        ])]
      })
    }


    validateTitle(controls){
    	var regExp = new RegExp(/^[a-zA-Z0-9 '-]+$/);
        if(regExp.test(controls.value)){
        	return null; //passes, no errors
        } else {
        	return {validateTitle: true}//error, *ngIf = true = show error <li>
        }
    }

    validateBody(controls){
      var regExp = new RegExp(/^[a-zA-Z0-9 '-]+$/);
        if(regExp.test(controls.value)){
          return null; //passes, no errors
        } else {
          return {validateBody: true}//error, *ngIf = true = show error <li>
        }
    }


  updateBlogSubmit() {
  	this.processing = true;
  	this.blogService.editBlog(this.blog).subscribe(data => {
  		if (!data.success) {
  			this.messageClass = "alert alert-danger";
  			this.message = data.message;
  			this.processing = false;
  		} else {
  			this.messageClass = "alert alert-success";
  			this.message = data.message;
  			setTimeout(() => {
  				this.router.navigate(['/blog']);
  			}, 2000);
  		}
  	});
  }

// needs location
  goBack() {
  	this.location.back();
  }

  ngOnInit() {
  	 this.currentUrl = this.activatedRoute.snapshot.params;
  	 this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
  	 	if (!data.success) {
  	 		this.messageClass = 'alert alert-danger';
  	 		this.message = data.message;
  	 	} else {
  	 		 this.blog = data.blog;
  	 		 this.loading = false;
  	 	  }
  	 });
  }

}
