import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { ParamsService } from './params.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
    public mainWidth: string //taille du canvas
    public mainHeight: string 
    public ctx: CanvasRenderingContext2D | any;
    public preCases: number[][] = []
    public cases: number[][] = []; //tableau formé par le canva afin d'appliquer les regles de la fire forest
    public size: number;
    public expansion: number;
    public starter: number;
    public width: number
  constructor(public paramservice: ParamsService){
    this.size = environment.size;
    this.expansion = environment.expansion;
    this.starter = environment.starters;
    this.width = environment.width
  }
  ngOnInit(): void {
    this.initCases();  
  }
  initGrid() { //initialisation de la grille en suivant le tableau cases. fonction appellé à chaque iteration afin de déssiner la grille selon le nouvel état du tableau cases
    var width = this.width
    var count = 0
    var size = this.size
    for (var i = width/size; i <= width; i+= width/size){
      for (var j = width/size; j <= width; j+= width/size) {
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
        this.ctx.strokeRect((j-(width/size)),i,(width/size),(width/size));
        this.ctx.fillRect((j-(width/size)),i,(width/size),(width/size));
        count ++
      }
    } 
  }
  initCases() {//initie une seule fois le tableau.
    const size = this.size
    this.cases = []
    const starters = this.starter
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.width; 
    this.canvas.nativeElement.height = this.width;
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
  preRender() { //fonction qui calcule le nouvel etat de cases en construisant un tableau precases
    const length = this.cases.length;
    const expansion = this.expansion
    const size =  this.size
    for (var i = 0; i < length; i++) {//check l'état de chacune des cases autour de la case sur laquelle porte l'iteration et calcule la probabilité de propagation
      if (this.cases[i][2] === 1) {
        this.preCases.push(this.cases[i].slice());
        this.preCases[this.preCases.length - 1][2] = 2;
      } else if (this.cases[i][2] === 2) {
        this.preCases.push(this.cases[i].slice())
        this.preCases[this.preCases.length - 1][2] = 2;
      } else {
        if (i + (size + 2) < length && this.cases[i + size][2] === 1 && Math.random() * 100 < expansion) { //case du haut
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        } else if (i - size - 2 >= 0 && this.cases[i - size][2] === 1 && Math.random() * 100 < expansion) {//case du bas
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        } else if (i + 1 < length && this.cases[i + 1][2] === 1 && Math.random() * 100 < expansion && this.cases[i][1] !== size-1) {//case à droite
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        } else if (i - 1 >= 0 && this.cases[i - 1][2] === 1 && Math.random() * 100 < expansion && this.cases[i][1] !== 0) {//case à gauche
            this.preCases.push(this.cases[i].slice());
            this.preCases[this.preCases.length - 1][2] = 1;
        }
        else {
          this.preCases.push(this.cases[i].slice());
          this.preCases[this.preCases.length - 1][2] = 0;
        }
      }
    }
    this.cases = this.preCases.slice()//on remplit donc le tableau cases en reinitialisant precases
    this.preCases = [] 
  }
  next () {
    this.preRender();
    this.initGrid();
  }
  play() {
    let c = setInterval(()=>this.next(),10)
  }
}