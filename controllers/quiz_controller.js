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
		res.render('quizes/show', {quiz: quiz})
	})
	//res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
		}
		else{
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
		}
	})
	/*
	if(req.query.respuesta === 'Roma'){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	} else{
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
	*/
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
			res.render('quizes/index.ejs', {quizes:quizes});
		}).catch(function(error){next(error);})
	/*
	models.Quiz.findAll().then(function(quizes){		
		res.render('quizes/index.ejs', {quizes: quizes});
	}).catch(function(error){ nexr(error);})	
	*/
};
