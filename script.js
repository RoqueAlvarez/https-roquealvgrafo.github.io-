function generarArbol() {
  const operacion = document.getElementById('operacion').value;
  const contenedorGrafico = document.getElementById('contenedor-grafico');
  contenedorGrafico.innerHTML = '';
  if (!validarExpresion(operacion)) {
    alert('Expresión inválida.');
    return;
  }
  const nodoRaiz = analizarOperacion(operacion);
  const nodos = [];
  const aristas = [];
  construirGrafico(nodoRaiz, nodos, aristas, 300, 50, 150);
  nodos.forEach(nodo => dibujarNodo(nodo));
}

function validarExpresion(expresion) {
  const tieneNumerosNegativos = /-\d/.test(expresion);
  return !tieneNumerosNegativos;
}

function analizarOperacion(operacion) {
  const tokens = operacion.match(/(\d+|\+|\-|\*|\/|\(|\))/g);
  const colaSalida = [];
  const pilaOperadores = [];
  const precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };
  tokens.forEach(token => {
    if (/\d/.test(token)) {
      colaSalida.push({ valor: token });
    } else if (/\+|\-|\*|\//.test(token)) {
      while (pilaOperadores.length && precedencia[pilaOperadores[pilaOperadores.length - 1].valor] >= precedencia[token]) {
        colaSalida.push(pilaOperadores.pop());
      }
      pilaOperadores.push({ valor: token });
    } else if (token === '(') {
      pilaOperadores.push({ valor: token });
    } else if (token === ')') {
      while (pilaOperadores.length && pilaOperadores[pilaOperadores.length - 1].valor !== '(') {
        colaSalida.push(pilaOperadores.pop());
      }
      pilaOperadores.pop();
    }
  });
  while (pilaOperadores.length) {
    colaSalida.push(pilaOperadores.pop());
  }
  const pila = [];
  colaSalida.forEach(token => {
    if (/\d/.test(token.valor)) {
      pila.push(token);
    } else {
      const derecho = pila.pop();
      const izquierdo = pila.pop();
      pila.push({ valor: token.valor, izquierdo: izquierdo, derecho: derecho });
    }
  });
  return pila[0];
}

function construirGrafico(nodo, nodos, aristas, x, y, desplazamiento) {
  if (!nodo) return;
  const idNodo = nodos.length + 1;
  nodos.push({ id: idNodo, etiqueta: nodo.valor, x: x, y: y });
  if (nodo.izquierdo) {
    const idIzquierdo = nodos.length + 1;
    aristas.push({ desde: idNodo, hacia: idIzquierdo });
    construirGrafico(nodo.izquierdo, nodos, aristas, x - desplazamiento, y + 150, desplazamiento / 2);
  }
  if (nodo.derecho) {
    const idDerecho = nodos.length + 1;
    aristas.push({ desde: idNodo, hacia: idDerecho });
    construirGrafico(nodo.derecho, nodos, aristas, x + desplazamiento, y + 150, desplazamiento / 2);
  }
}

function dibujarNodo(nodo) {
  const elementoNodo = document.createElement('div');
  elementoNodo.classList.add('nodo');
  elementoNodo.style.left = `${nodo.x}px`;
  elementoNodo.style.top = `${nodo.y}px`;
  elementoNodo.innerHTML = nodo.etiqueta;
  document.getElementById('contenedor-grafico').appendChild(elementoNodo);
  return elementoNodo;
}