var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			} else{
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error){ next(error);});
};

//GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: quiz, errors: []})
	})
	//res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta){
			resultado = 'Correcto';			
		}
		res.render(
			'quizes/answer', 
			{ quiz: req.quiz, 
			  respuesta: resultado,
			  errors: []
			});		
	})	
};

exports.author = function(req, res){
	res.render('author/author', {author: 'José Christian Martínez Pineda', photo:'http://www.orce.uni.edu.pe/fotosuni/006020034526J.jpg'});	
};

// GET /quizes
exports.index = function(req, res){
	var search = req.query.search?req.query.search:"";	
	search = search.replace(" ","%");
	search = "%"+search+"%";		
	
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes){
			res.render('quizes/index.ejs', {quizes:quizes, errors: []});
		}).catch(function(error){next(error);})
	/*
	models.Quiz.findAll().then(function(quizes){		
		res.render('quizes/index.ejs', {quizes: quizes});
	}).catch(function(error){ nexr(error);})	
	*/
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
			{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req,res){		
	var quiz = models.Quiz.build( req.body.quiz );	
	//guarda en DB los campos pregunta y respuesta de quiz
	quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}
			else{
				quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function(){ res.redirect('/quizes'); })	//Redireccion http (URL relativo) lista de preguntas
			}
		}
	);	
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /QUIZES/:ID
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
			}
			else{
				req.quiz
				.save( {fields: ["pregunta", "respuesta"]} )
				.then( function() { res.redirect('/quizes'); });
			}
		}
	);
};