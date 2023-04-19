//Clase que modela la suscripción que tiene asociada un usario logueado en Filmin' . Hay tres tipos.
class Suscripcion {
  //Propiedades
  #tipoPago;
  #precio;
  #ahorro;
  #descripcion;

  //Métodos
  constructor(tipoPago, precio, ahorro = "", descripcion) {
    this.#tipoPago = tipoPago;
    this.#precio = precio;
    this.#ahorro = ahorro;
    this.#descripcion = descripcion;
  }

  getTipoPago() {
    return this.#tipoPago;
  }
  getPrecio() {
    return this.#precio;
  }
  getAhorro() {
    return this.#ahorro;
  }
  getDescripcion() {
    return this.#descripcion;
  }
}

export default Suscripcion;
