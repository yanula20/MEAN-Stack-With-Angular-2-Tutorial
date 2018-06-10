import { Component } from '@angular/core';

/* component decorator, references import statement above 
   selector points to another .html or app.component.html
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/* component class contains, attributes, properties, functions,
dependency injections (auth, auth guard, rxjs);
class object also contains two-way binding properties with 
component.html; data can be accessible in both directions
*/
export class AppComponent {
  title = 'Hello World from Angular 2!';
}
