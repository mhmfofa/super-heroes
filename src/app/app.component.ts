import { Component } from '@angular/core';
import { HeroesReportComponent } from "./components/heroes-report/heroes-report.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroesReportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'super-heroes';
}
