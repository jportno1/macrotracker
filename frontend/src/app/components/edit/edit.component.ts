import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';

import { FoodService } from '../../food.service';
import { Food } from '../../food.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: String;
  food: any = {};
  updateForm: FormGroup;

  // tslint:disable-next-line:max-line-length
  constructor(private foodService: FoodService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      servings: '',
      diet: '',
      meal: ''
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.foodService.getFoodById(this.id).subscribe(res => {
        this.food = res;
        this.updateForm.get('title').setValue(this.food.title);
        this.updateForm.get('servings').setValue(this.food.servings);
        this.updateForm.get('diet').setValue(this.food.diet);
        this.updateForm.get('meal').setValue(this.food.meal);
      });
    });
  }

  updateFood(title, servings, diet, meal) {
    this.foodService.updateFood(this.id, title, servings, diet, meal).subscribe(() => {
      this.snackBar.open('Food updated successfully', 'OK', {
        duration: 3000
      });
    });
  }

}
