import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService} from '../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  username;
  processing = false;

  constructor(

  	private formBuilder: FormBuilder,
  	private authService: AuthService,
  	private blogService: BlogService

  	) { 

  	this.createNewBlogForm();
  }

  	createNewBlogForm() {
  		this.form = this.formBuilder.group({
  			title: ['', Validators.compose([
  				Validators.required,
  				Validators.maxLength(50),
  				Validators.minLength(5),
  				this.alphaNumericValidation
  			])],
  			body: ['', Validators.compose([
  				Validators.required,
  				Validators.maxLength(1000),
  				Validators.minLength(5)
  			])]
  		})
  	}


  	enableFormNewBlogForm() {
  		this.form.get('title').enable();
		this.form.get('body').enable();
  	}

  	disableFormNewBlogForm() {
  		this.form.get('title').disable();
		this.form.get('body').disable();
  	}

  	alphaNumericValidation(controls) {
  		var regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
  		if (regExp.test(controls.value)) {
  			return null;//passes
  		} else {
  			return {'alphaNumericValidation': true}//fails
  		}
  	}

  	newBlogForm() {

  		this.newPost = true;
  	}

  	reloadBlogs() {
  		this.loadingBlogs = true;
  		//get all blogs
  		setTimeout(() => {
  			this.loadingBlogs = false;
  		}, 4000);	
  	}


  	draftComment() {

  		console.log('Form Submitted');
  	}


  	onBlogSubmit() {
  		this.disableFormNewBlogForm();
  		this.processing = true; 

  		var blog = {
  			title: this.form.get('title').value,
  			body: this.form.get('body').value,
  			createdBy: this.username
  		}

  		this.blogService.newBlog(blog).subscribe(data => {
  			if (!data.success) {
  				this.messageClass = 'alert alert-danger';
  				this.message = data.message;
  				this.processing = false;
  				this.enableFormNewBlogForm();
  			} else {
  				this.messageClass = 'alert alert-success';
  				this.message = data.message;
  				setTimeout(() => {
  					this.newPost = false;
  					console.log('processing');
  					this.processing = false;
  					this.message = false;
  					this.form.reset();
  					this.enableFormNewBlogForm();
  				}, 2000);
  			 }
  		});
  	}



  	goBack() {
  		console.log('go back');
  		window.location.reload();
  	}

  ngOnInit() {
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;
  	});
  }

}
