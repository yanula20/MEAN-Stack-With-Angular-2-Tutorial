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
  commentForm;
  username;  
  processing = false;
  blogPosts;
  newComment = [];
  enabledComments = [];

  constructor(

  	private formBuilder: FormBuilder,
  	private authService: AuthService,
  	private blogService: BlogService

  	) { 

  	this.createNewBlogForm();
    this.createCommentForm();
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

    createCommentForm() {
      this.commentForm = this.formBuilder.group({
        comment: ['', Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(200)
          ])]
      });
    }


    enableCommentForm() {
      this.commentForm.get('comment').enable();
    }

     disableCommentForm() {
      this.commentForm.get('comment').disable();
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
  		this.getAllBlogs();
  		setTimeout(() => {
  			this.loadingBlogs = false;
  		}, 4000);	
  	}



    cancelSubmission(id) {
      var index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.commentForm.reset();
      this.enableCommentForm();
      this.processing = false;

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
  				this.getAllBlogs();
  				setTimeout(() => {
  					this.newPost = false;
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

  	getAllBlogs() {
  		this.blogService.getAllBlogs().subscribe(data => { this.blogPosts = data.blogs;});
  	}

  	likeBlog(id) {
  		this.blogService.likeBlog(id).subscribe(data => { this.getAllBlogs(); });

  	}

  	dislikeBlog(id) {
  		this.blogService.dislikeBlog(id).subscribe(data => { this.getAllBlogs(); });

  	}

    postComment(id) {
      this.disableCommentForm();
      this.processing = true;
      var comment = this.commentForm.get('comment').value;
      this.blogService.postComment(id, comment).subscribe(data => {
        this.getAllBlogs();
        var index = this.newComment.indexOf(id);
        this.newComment.splice(index, 1);
        this.enableCommentForm();
        this.commentForm.reset();
        this.processing = false;
        if (this.enabledComments.indexOf(id) < 0) {
          this.expand(id);
        }
      });
    }

    draftComment(id) {
      this.newComment = [];
      this.newComment.push(id);
    }

    expand(id) {
      this.enabledComments.push(id);
    }

    collapse(id) {
      var index = this.enabledComments.indexOf(id);
      this.enabledComments.splice(index, 1);

    }

  ngOnInit() {
  		this.authService.getProfile().subscribe(profile => { this.username = profile.user.username;});
  		this.getAllBlogs();
  }

}
