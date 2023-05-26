import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {
  public expansion: number = 60;
  public starters: number = 3;
  public size: number = 100;
  constructor() { }


  
}