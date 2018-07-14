import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Food } from '../../food.model';
import { FoodService } from '../../food.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  foods: Food[];
  nutrients: {
    totProtein: 0,
    totCalories: 0,
    totFat: 0,
    totCarbs: 0
  }
  displayedColumns = ['title', 'servings', 'diet', 'meal', 'delete', 'calories', 'protein', 'fat', 'carbs'];

  constructor(private foodService: FoodService, private router: Router) { }

  ngOnInit() {
    this.fetchFoods();
  }

  fetchFoods() {
    this.foodService
      .getFoods()
      .subscribe((data: Food[]) => {
        this.foods = data;
        console.log(this.foods);

        for(var i = 0; i < this.foods.length; i++) {
          console.log(this.foods[i]);
        }
      });
  }

  // editFood(id) {
  //   this.router.navigate([`/edit/${id}`]);
  // }

  deleteFood(id) {
    this.foodService.deleteFood(id).subscribe(() => {
      this.fetchFoods();
    });
  }

  totalMacros() {
    this.foodService
      .getFoods()
      .subscribe((data: Food[]) => {
        this.foods = data;
        console.log('Data requested ...');
        console.log(this.foods);
        
      });
  }

}
