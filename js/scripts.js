let fecha = new Date();
let horaActual = fecha.getHours();

let header = `
<div class="container" id="barra_superior">
  <div class="row w-100">
    
    <div class="col-md-5 col-sm-4 col-lg-4">
      <div class="card border-0" id="divLogo">
        <img id="logo" src="../images/logo.jpeg" alt="logo" />
      </div>
    </div>
    
    <div class="col-md-6 col-sm-7 col-lg-8" id="buscador">
    <div class="card border-0 " id="divBuscador">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Buscar ciudad" aria-label="" aria-describedby="basic-addon2">
      <div class="input-group-append">
        <button class="btn btn-secondary" type="button" id="botonBuscar"><i class="fa fa-search"></i></button>
      </div>
    </div>
  </div>

  
</div>
     

  </div>
</div>
<nav class="main-nav">
      <div id="toggle-menu" class="toggle-menu">
        <label for="toggle-menu-checkbox">
          <img src="../images/hamburguer-icon.png" alt="" />
        </label>
      </div>
      <input
        type="checkbox"
        class="toggle-menu__checkbox"
        id="toggle-menu-checkbox"
      />
      <ul id="main-menu" class="main-menu">
        <li class="main-menu__item">
          <a href="index.html#sec_hoy" class="main-menu__link">Hoy</a>
        </li>
        <li class="main-menu__item">
          <a href="index.html#sec_diario" class="main-menu__link">Pronóstico diario</a>
        </li>
        <li class="main-menu__item">
          <a href="index.html#sec_aire" class="main-menu__link">Calidad del aire</a>
        </li>
      </ul>
    </nav>
`;

const claseHeader = [...document.querySelectorAll(".idHeader")];
claseHeader.forEach(function(elemento) {
  elemento.innerHTML = header;
});

let footer = ` 
<nav class="main-nav">
  <div class="footer-nav">
    <ul class="footer-menu">
      <li class="main-menu__item">
        <a href="index.html" class="main-menu__link">Inicio</a>
      </li>
      <li class="main-menu__item">
        <a href="nosotros.html" class="main-menu__link">Quiénes somos</a>
      </li>
      <li class="main-menu__item">
        <a href="registro.html" class="main-menu__link">Suscríbete</a>
      </li> 
    </ul>
  </div>
</nav>
<div class="footer-copyright">
<span>&copy;</span> 2024 - Todos los derechos reservados
</div>
` ;
const claseFooter = [...document.querySelectorAll(".idFooter")];
claseFooter.forEach(function(elemento) {
  elemento.innerHTML = footer;
});

/* convierte la primera letra de la oración a mayúscula*/
const toSentenceCase = str => {
  const s =
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .join(' ');
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};

const toggleMenuElement = document.getElementById("toggle-menu");
const mainMenuElement = document.getElementById("main-menu");

toggleMenuElement.addEventListener("click", () => {
  mainMenuElement.classList.toggle("main-menu--show");
});

const APP_ID = "4090239d69cdb3874de692fd18539299";

const fetchData = (position) => {
  const {latitude, longitude} = position.coords;
  fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=es&units=metric&appid=${APP_ID}`
    )
    .then((response) => response.json())
    .then((data) => setWeatherData(data));
};

const setWeatherData = (data) => {
  const weatherData = {
    location: data.name,
    description: toSentenceCase(data.weather[0].description),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    temperature: Math.floor(data.main.temp),
    date: getDate(),
    min: Math.floor(data.main.temp_min),
    max: Math.floor(data.main.temp_max),
    sensacion: Math.floor(data.main.feels_like),
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg //Wind direction, degrees
  };

  let iconCode = data.weather[0].icon;

  document.getElementById("description").textContent = weatherData.description;
  document.getElementById("temperature").textContent = weatherData.temperature;
  document.getElementById("sensacion").textContent = weatherData.sensacion;
  document.getElementById("maximos").textContent = weatherData.max + "º/" + weatherData.min + "º";
  document.getElementById("humedad").textContent = weatherData.humidity + "%";
  document.getElementById("presion").textContent = weatherData.pressure + " hPa";
  document.getElementById("viento").textContent = weatherData.windSpeed + " m/s";
   
  const ubicacion = [...document.querySelectorAll(".ubicacion")];
  ubicacion.forEach(function(elemento) {
    elemento.textContent = weatherData.location;
   
  });


  let imagen = document.getElementById("bloqueHoy");
  let urlIcono = "http://openweathermap.org/img/wn/" + iconCode + "@4x.png";
  imagen.src=urlIcono;
  imagen.style.backgroundPosition = "0 0";

  cleanUp();
};

const cleanUp = () => {
  let container = document.getElementById("container");
  let loader = document.getElementById("loader");

  loader.style.display = "none";
  container.style.display = "flex";
};

const getDate = () => {
  let date = new Date();
  return `${date.getDate()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
};


const temperaturaPorDiaHora = (position) => {
  const {latitude, longitude} = position.coords;
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=es&units=metric&appid=${APP_ID}`
  )
  .then((response) => response.json())
  .then((data) => setPorDiaHora(data));
}

const setPorDiaHora = (data) => {

  let dia = "";
  let fechaAuxiliar = null;
  let cantidadHoras = 1; //guarda la cantidad de horas a mostrar

  document.getElementById('tbody').insertRow(-1).innerHTML = "";

  data.list.forEach(function(elemento) {  

   let iconCode = elemento.weather[0].icon;
   let fechaActual = new Date(elemento.dt_txt).toLocaleDateString();
   let horaActual = new Date(elemento.dt_txt).toLocaleTimeString();
   
   if (fechaActual != fechaAuxiliar)
   {
    fechaActual = new Date(elemento.dt_txt).toLocaleDateString();
    dia = dia + `<div class="col-lg-2 tarjetaDiaria">                                
                  <div class="card card-primary card-outline cardDia">
                      <div class="card-body">
                          <h5 class="text-center">${fechaActual}</h5>
                          <div class="text-center">                          
                            <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png">   
                          </div>
                          <p class="text-muted text-center">Máxº/Mínº</p>                    
                          <p class="text-muted text-center">${elemento.main.temp_max}º/${elemento.main.temp_min}º</p>
                      </div>
                  </div>
              </div>
            `;
   }  
   fechaAuxiliar = new Date(elemento.dt_txt).toLocaleDateString();
                        
   document.getElementById("pronosticoDiario").innerHTML = dia;
 
   if (cantidadHoras <= 10){
    let iconCode = elemento.weather[0].icon;
    let nuevaFila   = '<td class="align-middle">' + fechaActual + " " + horaActual + '</td>';
    nuevaFila  += '<td class="align-middle">' + Math.floor(elemento.main.temp) + ' ºC</td>';
    nuevaFila  += `<td><img src="http://openweathermap.org/img/w/${iconCode}.png"></td>`;
    nuevaFila  += '<td class="align-middle">' + toSentenceCase(elemento.weather[0].description) + '</td>';
      
    document.getElementById('tbody').insertRow(-1).innerHTML = nuevaFila;
    cantidadHoras += 1;
   }

  });

}

const indicePolucion = ["Buena", "Regular", "Moderada", "Mala", "Muy mala"];
const polucion = (position) => {
  const {latitude, longitude} = position.coords;
  const fecha = position.timestamp;
  fetch(
     `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${APP_ID}`
    
  )
  .then((response) => response.json())
  .then((data) => setPolucion(data.list[0]));
}

const setPolucion = (data) => {
  document.getElementById("polucion").textContent = toSentenceCase(indicePolucion[data.main.aqi - 1]);
 
  let elementoPolucion = document.getElementById("componentesPolucion");
  elementoPolucion.innerHTML = "";
  elementoPolucion.innerHTML = elementoPolucion.innerHTML + `<label for="" class="col-sm-12 col-form-label text-gray">CO (Monóxido de carbono): ${data.components.co} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">NO (Óxido de nitrógeno): ${data.components.no} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">NO2 (Dióxido de nitrógeno): ${data.components.no2} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">O3 (Ozono): ${data.components.o3} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">SO2 (Dióxido de azufre): ${data.components.so2} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">PM2.5 (Partículas en suspensión menores a 2,5 micrones): ${data.components.pm2_5} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">PM10 (Partículas en suspensión menores a 10 micrones): ${data.components.pm10} μg/m3</label>
  <label for="" class="col-sm-12 col-form-label text-gray">NH3 (Amoniaco): ${data.components.nh3} μg/m3</label>
  `;
  
}

function fondoBody(){
   let body = document.getElementsByTagName("body")[0];

  if (horaActual > 7 && horaActual < 21) {
    body.style.backgroundImage = 'url("../images/dia.jpg")';
    body.style.backgroundPosition = "0 0";
    body.style.color = "#000000";
  } else {
    body.style.backgroundImage = 'url("../images/noche.jpg")';
    body.style.backgroundPosition = "0 0";
    body.style.color = "#FFFFFF";
  }
}

const onLoad = () => {
  navigator.geolocation.getCurrentPosition(fetchData);
  navigator.geolocation.getCurrentPosition(temperaturaPorDiaHora);
  navigator.geolocation.getCurrentPosition(polucion);
   
};

