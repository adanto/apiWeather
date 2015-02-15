//Ejemplo de closure 
var contador = (function() {
	var _contadorPrivado = 0;

	function _cambiarValor(valor) {
		_contadorPrivado += valor;
	};

	return {
		incrementar: function() {
			_cambiarValor(1);
		},
		decrementar: function() {
			_cambiarValor(-1);
		},
		valor: function() {
			return _contadorPrivado;
		}

	};
})();