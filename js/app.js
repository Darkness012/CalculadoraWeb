//Getting buttons and viewer
var btns = document.getElementsByClassName("tecla");
var textViewer = document.getElementById("display");

//Events
function onClickTecla(item){
  let elemento = item.currentTarget;
  let isNumber = Number(elemento.id);

  elemento.style.transform="scale(.9)";
  console.log(elemento.id);

  if(isNumber){
    if (calculator.startWithCero) calculator.replaceLast(elemento.id);
    else calculator.updateDisplay(elemento.id);

    calculator.isOperando = false;
    calculator.isUsingNumber = true;
    calculator.startWithCero = false;

  }else{
    switch (elemento.id) {
      case "0":
        if (calculator.isOperando || !calculator.startWithCero) {
          calculator.updateDisplay(elemento.id);
          if(calculator.isOperando) calculator.startWithCero = true;
        }
        calculator.isOperando = false;
        calculator.isUsingNumber = true;
      break;
      case "on":
        calculator.resetData();
      break;
      case "mas":
        calculator.assignOperator("+")
      break;
      case "menos":
        calculator.assignOperator("-")
      break;
      case "por":
        calculator.assignOperator("*")
      break;
      case "dividido":
        calculator.assignOperator("/")
      break;
      case "punto":
        if ((!calculator.isUsingPoint && !calculator.isOperando) || calculator.isOperando) {
          if(calculator.isOperando) calculator.updateDisplay("0.");
          else calculator.updateDisplay(".");

          calculator.isOperando = false;
          calculator.isUsingPoint = true;
          calculator.startWithCero = false;
        }
      break;
      case "sign":
        if(calculator.canInvert){
          var number = (Number(calculator.textDisplay)*-1).toString();
          calculator.textDisplay = number;
          calculator.updateDisplay(number, true);
        }
      break;
      case "raiz":
        if(calculator.canInvert){
          if(calculator.textDisplay.includes("-")){
            calculator.resetData();
            console.log("error")
          }else{
            var number = (Math.sqrt(Number(calculator.textDisplay))).toString();
            if(!(Number.isInteger(Number(number)))) calculator.isUsingPoint = true;
            calculator.updateDisplay(number, true);
          }
        }
      break;
      case "igual":
        calculator.printFinalValue();
      break;
      default:
        console.log("Tecla no funcional")
      break;
    }
  }
}
function onLeaveTecla(item){
  let elemento = item.currentTarget;
  elemento.style.transform="scale(1.0)";
}

//Adding events to the buttons
(function(){
  for(position in btns){
    btns[position].onclick = onClickTecla;
    btns[position].onmouseleave = onLeaveTecla;
  }
})();

//Calculator Object and actions
var calculator = {
  startApp: function(btns, viewer){
    this.btns = btns;
    this.textViewer = viewer;
    this.textDisplay="0";
    this.isOperando = false;
    this.isUsingPoint = false;
    this.isUsingNumber = false;
    this.canInvert = true;
    this.startWithCero = true;
  },
  updateDisplay: function(newValue, replace){
    let reduced = "";
    if(replace) reduced = this.updateTextSize(newValue);
    else        reduced = this.updateTextSize(this.textDisplay+""+newValue);
    this.textDisplay = reduced;
    this.textViewer.innerHTML=reduced;
  },
  updateTextSize: function(texto){
    let arraySplit = texto.split("");
    let size = arraySplit.length;
    let newText = texto;

    if(size<=9) this.textViewer.style.fontSize="5.0rem";
    else if (size<=11 && size>9)  this.textViewer.style.fontSize="4.0rem";
    else if (size<=15 && size>11) this.textViewer.style.fontSize="3.0rem";
    else if (size<=23 && size>15) this.textViewer.style.fontSize="2.0rem";
    else if (size>23){
      arraySplit.splice(23, size-23);
      let reducido = arraySplit.join("");
      this.textViewer.style.fontSize="2.0rem";
      newText = reducido;
    }

    return newText;
  },
  assignOperator: function(operador){
    if(!calculator.startWithCero){
      if(this.isUsingNumber){
        this.isUsingPoint = false;
        this.canInvert = false;
        this.isUsingNumber = false;
        calculator.startWithCero = false;
        this.isOperando = true;
        this.updateDisplay(operador);
      }else{
        if (this.isOperando) this.replaceLast(operador);
      }
    }
  },
  resetData: function(){
    this.textDisplay = "0";
    this.isOperando = false;
    this.isUsingPoint = false;
    this.isUsingNumber = false;
    this.startWithCero = true;
    this.updateTextSize("0");
    this.textViewer.innerHTML="0";
  },
  replaceLast: function(value){
    let tempArray = this.textDisplay.split("");
    if(this.textDisplay.length==1){
      this.updateDisplay(value, true);
      return value;
    }
    tempArray[tempArray.length-1] = value;
    let newValues = tempArray.join("");
    this.updateDisplay(newValues, true);
    return newValues;
  },
  printFinalValue: function(){
    if(this.isOperando){
      this.replaceLast("");
    }
    let result = eval(this.textDisplay).toString();
    console.log(result)
    this.isOperando = false;
    this.isUsingNumber = true;
    this.canInvert = true;
    this.updateDisplay(result, true);
    if(result.length==1){
      this.isUsingPoint = false;
      if(result==="0") this.startWithCero = true;
    }else{
      if(!(Number.isInteger(Number(result)))){
        this.isUsingPoint = true;
      }
      this.startWithCero = false;
    }
  }
}

//StartingApp
calculator.startApp(btns, textViewer);
