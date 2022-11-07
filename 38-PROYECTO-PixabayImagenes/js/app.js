const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPaginas = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);

}

function validarFormulario(e) {

    e.preventDefault();
    const terminiBusqueda = document.querySelector("#termino").value;

    if (terminiBusqueda === "") {

        mostrarMensaje("Agrega un termino de busqueda");
        return;
    }

    buscarImagenes();

}


function mostrarMensaje(mensaje) {

    const existe = document.querySelector(".bg-red-100");

    if (!existe) {

        const alerta = document.createElement("P");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");

        alerta.innerHTML = `
    <strong class="font-bold">Error!</span>
    <span class="block sm:inline">${mensaje}<span>
    `;
        formulario.appendChild(alerta);

        setTimeout(() => { alerta.remove() }, 3000)

    }


}

function buscarImagenes() {

    const termino = document.querySelector("#termino").value;
    const key = "31127600-85cfd5ece9eba83cb96a677d2";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPaginas}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {

            console.log(resultado);
            totalPaginas = calcularPaginas(resultado.totalHits);
            //console.log(totalPaginas);
            mostrarImagenes(resultado.hits);
        })

}

// Generador que va a registrar la cantidad de elementos de acurdo a las paginas

function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {

    return parseInt(Math.ceil(total / registrosPorPaginas))

}

function mostrarImagenes(imagenes) {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    };

    // 
    imagenes.forEach(imagen => {
        // console.log(imagen);
        const contenedor = document.createElement("DIV");
        contenedor.classList.add("w-1/2", "md:w-1/3", "lg:w-1/4", "p-3", "mb-4")

        const contenedorImagen = document.createElement("DIV");
        contenedorImagen.classList.add("bg-white");

        const img = document.createElement("IMG");
        img.src = imagen.previewURL;
        img.classList.add("w-full")

        const contenedorTexto = document.createElement("DIV");
        contenedorTexto.classList.add("p-4", "bg-white");

        contenedorTexto.innerHTML = `
        
        <p class="font-bold">${imagen.likes}<span class="ml-2 font-light">Me gusta</span></p>
        <p class="font-bold mb-5">${imagen.views}<span class="ml-2 font-light">Vistas</span></p>

        <a class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 py-2" href="${imagen.largeImageURL}" target="_blank" rel="nooponer noreferrer">Ver imagen </a>
        
        `;

        contenedorImagen.appendChild(img);
        contenedor.appendChild(contenedorImagen);
        contenedor.appendChild(contenedorTexto);
        resultado.appendChild(contenedor);

    });


    imprimirPaginador()


}

function imprimirPaginador() {

    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    iterador = crearPaginador(totalPaginas);

    while (true) {

        const { value, done } = iterador.next();
        if (done) return;

        //  Caso contrario, genera un boton por cada elemento en el generador

        const boton = document.createElement("A");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-3", "rounded", "hover:bg-yellow-300");

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);

    }

}