import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardService } from '../../service/dashboard.service';
import { applyLoader } from '../../util/Decorators';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CommonModule, CurrencyPipe, LowerCasePipe } from '@angular/common';
import { BarChartComponent } from '../shared/charts/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCard, 
    MatCardContent,
    MatCardTitle,
    LowerCasePipe,
    BarChartComponent,
    RouterLink,
    CurrencyPipe,
    CommonModule
    
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private service: DashboardService,
    private route: ActivatedRoute
  ) {}

  id!: string;
  source!: string;
  setType!: string;
  fullStats: any = {};

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = params["id"];
      this.source = params["source"];
      this.setType = params["setType"];
      this.getStats(this.id, this.source, this.setType);
    });
  }
  @applyLoader()
  getStats(id: string, source: string, setType: string) {
    this.service.getStats(id, source, setType).subscribe((data) => {
      this.fullStats = data;
      console.log(this.fullStats);
    });
  }

  setRarityColor(rarity: string) {
    return GeneralFunctions.colorRarity(rarity);
  }

  cardImagem(cardId: any) {
    var num: number = +cardId;
    let urlimg = GeneralFunctions.cardImagem + num + ".jpg";
    return urlimg;
  }
}
