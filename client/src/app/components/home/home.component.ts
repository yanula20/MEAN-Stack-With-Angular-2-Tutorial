import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	title = 'Don\'s Angular 2 Project';
	instructor = 'Dave Acosta';

  constructor(
  		private authService: AuthService
  	) 

  { }

  ngOnInit() {
  }

}
