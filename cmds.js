const readline = require("readline");
const {log, biglog, errorlog, colorize} = require("./out");
const model = require("./model");

//Muestra la ayuda
exports.helpCmd = rl => {
  		console.log("Comandos:");
  		console.log("	h|help - Muestra esta ayuda.");
  		console.log("	list - Listar los quizzes existentes.");
  		console.log("	show <id> - Muestra la pregunta y respuesta del quiz indicado");
  		console.log("	add - Añadir un nuevo quiz interactivamente.");
  		console.log("	delete <id> - Borrar el quiz indicado.");
  		console.log("	edit <id> - Editar el quiz indicado.");
  		console.log("	test <id> - Probar el quiz indicado.");
  		console.log("	p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
  		console.log("	credits - Créditos.");
  		console.log("	q|quit - Salir del programa.");
  		rl.prompt();
};

exports.quitCmd = rl => {
	rl.close();
	rl.prompt();
};

exports.addCmd = rl => {
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

exports.listCmd = rl => {
	model.getAll().forEach((quiz,id) => {
		log(`  [${ colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

exports.showCmd = (rl,id) => {
	 if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch (error) {
            errorlog(error.message);            
        }
    }
	rl.prompt();
};

exports.testCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(`${colorize(quiz.question, 'red')} ${colorize('?', 'red')} `, answer => {
                if (answer === quiz.answer) {
                    log(`Su respuesta es correcta.`);
                    log(`${biglog('Correcta', 'green')}`);
                } else {
                    log(`Su respuesta es incorrecta.`);
                    log(`${biglog('Incorrecto', 'red')}`);
                }
                rl.prompt();
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }   
    }   
};

exports.playCmd = rl => {
	
log('Jugar.', 'red');
rl.prompt();
};

exports.deleteCmd = (rl, id) => {
	if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.editCmd = (rl, id) => {
	if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
        	const quiz = model.getByIndex(id);
 			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {  
            	process.stdout.isTTY && setTimeout(() => { rl.write(quiz.answer)}, 0);
                rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


exports.creditsCmd = rl => {
	console.log("Autores de la práctica: ");
    console.log("Jaime Madrid Alonso");
    rl.prompt();
};