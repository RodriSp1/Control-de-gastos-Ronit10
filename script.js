const form = document.getElementById('form');
const conceptoInput = document.getElementById('concepto');
const montoInput = document.getElementById('monto');
const tipoSelect = document.getElementById('tipo');
const lista = document.getElementById('lista');
const balanceTexto = document.getElementById('balance');
const ingresosTexto = document.getElementById('total-ingresos');
const gastosTexto = document.getElementById('total-gastos');

let movimientos = [];

try {
  const guardados = localStorage.getItem('movimientos');
  if (guardados) {
    movimientos = JSON.parse(guardados);
  }
} catch (e) {
  movimientos = [];
}

function guardar() {
  try {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
  } catch (e) {}
}

function formatoMoneda(cantidad) {
  return '$' + Number(cantidad).toFixed(2);
}

function actualizarUI() {
  lista.innerHTML = '';
  let ingresos = 0;
  let gastos = 0;

  movimientos.forEach((mov, index) => {
    const valor = Number(mov.monto);
    if (mov.tipo === 'ingreso') {
      ingresos += valor;
    } else {
      gastos += valor;
    }

    const li = document.createElement('li');

    const info = document.createElement('div');
    info.className = 'info-mov';

    const titulo = document.createElement('span');
    titulo.textContent = mov.concepto;

    const etiqueta = document.createElement('small');
    etiqueta.textContent = mov.tipo;

    info.append(titulo, etiqueta);

    const cantidad = document.createElement('span');
    cantidad.className = mov.tipo === 'ingreso' ? 'monto-mov es-ingreso' : 'monto-mov es-gasto';
    cantidad.textContent = (mov.tipo === 'ingreso' ? '+' : '-') + formatoMoneda(valor);

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    btnEliminar.setAttribute('aria-label', 'Eliminar');
    btnEliminar.addEventListener('click', () => {
      movimientos.splice(index, 1);
      guardar();
      actualizarUI();
    });

    li.append(info, cantidad, btnEliminar);
    lista.appendChild(li);
  });

  const balance = ingresos - gastos;
  balanceTexto.textContent = (balance < 0 ? '-' : '') + formatoMoneda(Math.abs(balance));
  ingresosTexto.textContent = formatoMoneda(ingresos);
  gastosTexto.textContent = formatoMoneda(gastos);
}

function registrarMovimiento(e) {
  if (e) e.preventDefault();

  const concepto = conceptoInput.value.trim();
  const monto = parseFloat(montoInput.value.replace(',', '.'));
  const tipo = tipoSelect.value;

  if (concepto === '' || isNaN(monto) || monto <= 0) return;

  movimientos.unshift({ concepto, monto, tipo });
  conceptoInput.value = '';
  montoInput.value = '';
  guardar();
  actualizarUI();
}

form.addEventListener('submit', registrarMovimiento);

actualizarUI();