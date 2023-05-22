import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { ParamsService } from './params.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  public mainWidth: string = '1000px';
  public mainHeight: string = '1000px'
  private ctx: CanvasRenderingContext2D | any;
  public cases: number[] = []; //tableau formé par le canva afin d'appliquer les regles de la fire forest
  public precases: number[] = []; //pré-tableau qui une fois les règles appliquées remplacera le tableau cases
  public sizeOptions: number[] =[50, 100, 200]
  public starters: number[] = [1,2,3]
  public expansions: number[] = [25,50,60,70,80,90,100]
  constructor(public paramservice: ParamsService){
  }
  ngOnInit(): void {
    this.initCases(this.paramservice.size,this.paramservice.starters, this.paramservice.expansion);
    
    
    
  }
  initGrid(size: number) { //initialisation de la grille en suivant le tableau cases
    var width = this.canvas.nativeElement.offsetWidth
    var count = 0
    for (var i = (width/size); i < (width-(width/size)); i+= (width/size)){
      for (var j = (width/size); j < (width-(width/size)); j+= (width/size)) {
        
        if (this.cases[count] === 0) {
          this.ctx.fillStyle =  "green"
          this.ctx.strokestyle = "green"
        }
        else if (this.cases[count] === 1) {
          this.ctx.fillStyle =  "red"
          this.ctx.strokestyle = "red"
        }
        else if (this.cases[count] === 2) {
          this.ctx.fillStyle =  "grey"
          this.ctx.strokestyle = "grey"
        }
        this.ctx.strokeRect((j-(width/size)),i,(width/size),(width/size));

        this.ctx.fillRect((j-(width/size)),i,(width/size),(width/size));
        count ++
      }
    }
    
  }
  initCases(size: number, starters : number, expansion: number) {
    this.cases = []
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = 1000; 
    this.canvas.nativeElement.height = 1000;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        this.cases.push(0)
      }
    }
    for (var i = 0; i < starters ; i ++) {
        var random = Math.floor(Math.random() * this.cases.length) 
        if (this.cases[random] === 1) {
          i = i - 1
        }
        else {
          this.cases[random] = 1
          
        }
      }
      this.initGrid(this.paramservice.size);
  }
  preRender(size: number, starters: number, expansion: number) {
    var length = this.cases.length
    for (var i = 0; i <= length; i ++) {
      if (this.cases[i] === 1) {
        this.precases.push(2) 
      }
      else if (((this.cases[i-size+2] === 1) && (this.cases[i] === 0)&&  ((Math.random()*100)<= expansion))||
      ((this.cases[i+size-2] === 1) && (this.cases[i] === 0)&& ((Math.random()*100)<= expansion))||
      ((this.cases[i+1] === 1) && (this.cases[i] === 0)&&  ((Math.random()*100)<= expansion))||
      ((this.cases[i-1] === 1) && (this.cases[i] === 0)&&  ((Math.random()*100)<= expansion))) {
        this.precases.push(1) 
      }
      else if(this.cases[i] === 0) {
        this.precases.push(0)
      }
      else if(this.cases[i] === 2) {
        this.precases.push(2)
      }
    }
    
    this.cases = this.precases
    this.precases = []
  }
  next(size: number, starters: number, expansion: number,) {
    this.preRender(size, starters, expansion);
    this.initGrid(size);
   
  }
}