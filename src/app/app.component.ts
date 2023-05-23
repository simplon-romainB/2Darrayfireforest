import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { ParamsService } from './params.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  public mainWidth: string = '1010px';
  public mainHeight: string = '1010px'
  private ctx: CanvasRenderingContext2D | any;
  public preCases: number[][] = []
  public cases: number[][] = []; //tableau formé par le canva afin d'appliquer les regles de la fire forest
  public sizeOptions: number[] =[50, 100, 200]
  public starters: number[] = [1,2,3]
  public expansions: number[] = [25,50,60,70,80,90,100]
  constructor(public paramservice: ParamsService){
  }
  ngOnInit(): void {
    this.initCases(this.paramservice.starters, this.paramservice.expansion);
    
    
    
  }
  initGrid() { //initialisation de la grille en suivant le tableau cases
    var width = this.canvas.nativeElement.width
    var count = 0
    var size = 100
    for (var i = 10; i <= 1000; i+= 10){
      for (var j = 10; j <= 1000; j+= 10) {
        
        if (this.cases[count][2] === 0) {
          this.ctx.fillStyle =  "green"
          this.ctx.strokestyle = "green"
        }
        else if (this.cases[count][2] === 1) {
          this.ctx.fillStyle =  "red"
          this.ctx.strokestyle = "red"
        }
        else if (this.cases[count][2] === 2) {
          this.ctx.fillStyle =  "grey"
          this.ctx.strokestyle = "grey"
        }
        else if (this.cases[count][2] === 3) {
          this.ctx.fillStyle =  "black"
          this.ctx.strokestyle = "black"
        }
        this.ctx.strokeRect((j-(width/size)),i,(width/size),(width/size));

        this.ctx.fillRect((j-(width/size)),i,(width/size),(width/size));
        count ++
      }
    }
    
    
  }
  initCases(starters : number, expansion: number) {
    this.cases = []
    var size = 100
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = 1100; 
    this.canvas.nativeElement.height = 1100;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        this.cases.push([i,j,0])
      }
    }
    
    for (var i = 0; i < starters ; i ++) {
        var randomHorizontal = Math.floor(Math.random() * size) 
        var randomVertical = Math.floor(Math.random() * size)
        if (this.cases.includes([randomVertical, randomHorizontal, 1]) ){
          i = i - 1
        }
        else {
          var location = this.cases.findIndex(item => {
            return item[0] === randomHorizontal && item[1] === randomVertical && item[2] === 0;
          });
          this.cases[location] = [randomHorizontal, randomVertical, 1]
          
        }
      }
      this.initGrid();
  }
  preRender( starters: number, expansion: number) {
    var length = this.cases.length;
    
    var size = 100
    for (var i = 0; i < length; i++) {
      if (this.cases[i][2] === 1) {
        this.preCases.push(this.cases[i].slice());
        this.preCases[this.preCases.length - 1][2] = 2;
      } else if (this.cases[i][2] === 2) {
        this.preCases.push(this.cases[i].slice())
        this.preCases[this.preCases.length - 1][2] = 2;
      } else {
        if (i + (size + 2) < length && this.cases[i + size][2] === 1 && Math.random() * 100 < expansion) {
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        } else if (i - size - 2 >= 0 && this.cases[i - size][2] === 1 && Math.random() * 100 < expansion) {
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        } else if (i + 1 < length && this.cases[i + 1][2] === 1  && this.cases[i][1] === size-1 ) {
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 3;
            console.log(this.cases[i][1])
        } else if (i - 1 >= 0 && this.cases[i - 1][2] === 1 &&  this.cases[i][1] === 0) {
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 3;
            console.log(this.cases[i][1])
        } else if (i + 1 < length && this.cases[i + 1][2] === 1 && Math.random() * 100 < expansion) {
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        } else if (i - 1 >= 0 && this.cases[i - 1][2] === 1 && Math.random() * 100 < expansion) {
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        }
        else {
          this.preCases.push(this.cases[i].slice());
          this.preCases[this.preCases.length - 1][2] = 0;
        }
      }
    }
    this.cases = this.preCases.slice()
    this.preCases = []
    
    
  }
  next (starters: number, expansion: number,) {
    this.preRender( starters, expansion);
    this.initGrid();
   
  }
}