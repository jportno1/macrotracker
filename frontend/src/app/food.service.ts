import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  // uri = 'http://localhost:3300';
  uri = 'https://macrotracker-jp.herokuapp.com';

  constructor(private http: HttpClient) { }

  getFoods() {
    return this.http.get(`${this.uri}/foods`);
  }

  getFoodById(id) {
    return this.http.get(`${this.uri}/foods/${id}`);
  }

  addFood(title, servings, diet, meal) {
    const food = {
      title: title,
      servings: servings,
      diet: diet,
      meal: meal
    };
  
    return this.http.post(`${this.uri}/foods/add`, food);
  }

  updateFood(id, title, servings, diet, meal) {
    const food = {
      title: title,
      servings: servings,
      diet: diet,
      meal: meal
    };
    return this.http.post(`${this.uri}/foods/update/${id}`, food);
  }

  deleteFood(id) {
    return this.http.get(`${this.uri}/foods/delete/${id}`);
  }
}
