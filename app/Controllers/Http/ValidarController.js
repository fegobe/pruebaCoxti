'use strict';
var SimpleHashTable = require('simple-hashtable');
var info_real = new SimpleHashTable();
class ValidarController {

	async index({view}){
		
		var nombre_archivo= 'PREGUNTAS.txt'; // nombre del archivo a cargar
		var ruta= ruta_carpeta+nombre_archivo; 
		var preguntas =[]
		// CARGA DE UN ARCHIVO
		let fs = require('fs');
		var contenido = await fs.readFileSync(ruta, 'utf-8') //lectura sincrona de un archivo
		contenido=contenido.toString()
		var preguntas = contenido.split("\n"); 
		var respuestas=generarRespuestas(); 
		return view.render('validar.index',{
		preguntas: preguntas, respuestas: respuestas
			})
		}

	async validar({request, response, view}){
		var es_valido=1; //bandera para comprobar si la respuesta dada fue valida 1= es valido, 0= no es valido
		var respuesta= request.input("respuestas");
		var nombre_archivo= 'INFORMACION.txt';
		var ruta= ruta_carpeta+nombre_archivo;
		let fs = require('fs');
		var contenido = await fs.readFileSync(ruta, 'utf-8')
		contenido=contenido.toString()
		var mapa= generarHash(contenido); // se llama al metodo generar hash y se le envia el texto con la infomacion
										  // del usuario
		if (respuesta[0]=="SI")
		{
			respuesta[0]='BCO COLPATRIA'; // respuesta[0] es la primera respuesta que dio el usuario, si esa respuesta
										  // es igual a SI significa que el usuario si tiene cuenta en el banco colpatria
		}
		var i=0
		for (i = 0; i < respuesta.length; i++) {
			if (!mapa.containsValue(respuesta[i])){ // comprobamos que la respuesta concuerde que la informacion real
				console.log("respuesta incorrecta= "+respuesta[i])
				es_valido=0;
				break;
			}
		}
		return view.render('validar.respuesta',{es_valido:es_valido})


	}
		
}
var ruta_carpeta = 'public/docs/';
// Metodo que convierte la entrada de texto informacion.txt en un mapa hash para su facil manejo

function generarHash(contenido){
	var lineas = contenido.split("\n");
	var i=0;
	for (i = 0; i < lineas.length; i++) {
		var separar= lineas[i].split(":"); //BANCOS_ASOCIADOS:BCO COLPATRIA,BANCOLOMBIA
		var cabecera = separar[0]; ///BANCOS_ASOCIADOS
		var respuestas = separar[1].split(","); //BCO COLPATRIA,BANCOLOMBIA
		var j=0;
		for (j = 0; j < respuestas.length; j++) {
			respuestas[j]=respuestas[j].replace('\r',"") //Despues de la lectura los archivos quedan con un /r al final
														 // que pueden generar problemas a la hora de comparar
			info_real.put(cabecera+j, respuestas[j]);    //+j para agregar tambien la informacion que tiene varias
														 // respuestas
		}
	}

	return info_real;
}

//se generan respuestas de manera manual
function generarRespuestas()
{
	var respuestas = [['SI', 'NO', 'NO SE','GUARDO LA PLATA DEBAJO DEL COLCHON'],
					  ['3045820738','3217285011','3145484874','3202581473'],
					  ['CARRERA 24 #22-36','CARRERA 23 #24-38','CARRERA 54 #23-132','CARRERA 73 #32-23']
];
return respuestas;

}
module.exports = ValidarController

