const container = document.getElementById('root');
const containerImage = document.getElementById('contenedor-img');
const containerLogin = document.getElementById('log');
const botonLogin = document.getElementById('botonlogin');
const create = 'Add Comment';
const edit = 'Edit';
let mood = create;
let referenceCommentToEdit;

window.onload = () => {
	// firebase
	var config = {
		apiKey: "AIzaSyB5VGUJtLOPuyrYmVKXNOO9JWw5sNhRX6k",
		authDomain: "socialnetwork-79af6.firebaseapp.com",
		databaseURL: "https://socialnetwork-79af6.firebaseio.com",
		projectId: "socialnetwork-79af6",
		storageBucket: "socialnetwork-79af6.appspot.com",
		messagingSenderId: "723320283252"
	};
	firebase.initializeApp(config);
	
	// iniciar sesión con google firebase al clickear botón
	botonLogin.addEventListener('click', (event) => { 
		let baseProvider = new firebase.auth.GoogleAuthProvider();
		baseProvider.addScope('email');
		firebase.auth().signInWithPopup(baseProvider)
		.then(result => {
			console.log(result);
			console.log('Succes... ', result.additionalUserInfo.profile.name);
		}).catch(err => {
			console.log(err);
			console.log('Failed... ', err);
		})
	})
	
	// cerrar sesión con google firebase al clickear botón
	document.getElementById('botonlogout').addEventListener('click', (event) => {
		firebase.auth().signOut();
		container.innerHTML = ''; // se limpia div con los comentarios
		containerImage.innerHTML = ''; // limpia div imagen
		containerLogin.style.display = 'block'; // re aparece botón login
	});
	
	// verifica si la sesión está iniciada
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			//console.log('AuthStateChanged', user);
			botonLogin.style.display = 'none'
			document.getElementById('botonlogout').style.display = 'block';
			createTextArea(user);
			show(user);
			//add();
			mostrarImagenesFirebase();
		} else {
			botonLogin.style.display = 'block'
			document.getElementById('botonlogout').style.display = 'none';
		}
	});
}

// mostrar textarea para agregar comentario
const createTextArea = (user) => {
	console.log(user.displayName)
	containerLogin.style.display = 'none';
	container.innerHTML += `<section><div class="container-fluid"><h5>Bienvenid@: ${user.displayName}</h5><div id="contenedor"></div><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="form-group text-center"><textarea class="txt" id="comment" placeholder="Comment..."></textarea><button type="button" class="btn btn-primary pull-right" id="btn-add">Add comment</button><div><label for="files" class="btn btn-primary" id="btn-image">Select Image</label> <input id="files" type="file"></div></div></div></div></div></section>`
	
	document.getElementById('btn-add').addEventListener('click', add);
	document.getElementById('files').addEventListener('change', upload);
};

// agrega comentario firebase
const add = (event) => {
	// muestra los comentarios guardados en firebase
	if (document.getElementById('comment').value.length === 0) {
		console.log('mensaje vacio')
		return;
	}
	// referencia al nodo raiz de la base de datos (comentarios) para crearle hijos
	const databaseRef = firebase.database().ref().child('comentarios');
	if (mood === create){
		// agrega comentarios a database firebase
		databaseRef.push({
			comment: document.getElementById('comment').value
		});
	}
	if (mood === edit) {
		referenceCommentToEdit.update({
			comment: document.getElementById('comment').value
		})
	}
	
	document.getElementById('comment').value = '';
	document.getElementById('btn-add').textContent = create;
};

// crear comentario y agrega en html
const show = (user) => {
	const containerComment = document.getElementById('contenedor');
	firebase.database().ref().child('comentarios').on('value', (snap) => {
		var datos = snap.val();
		let result = '';
		console.log(datos)
		for (let key in datos) {
			result += `<div class="card"><div class="row"><div class="col-xs-3"><a href="#profile" title="Profile"><img src="static/img/grumpy.jpg" class="img-circle img-user" alt="User"></a></div><div class="col-xs-9"><div class="comment"><h5><a href="#profile" title="Profile">Grumpy:</a></h5><p>${datos[key].comment}</p><div><i class="fas fa-heart"></i><i class="fas fa-trash-alt delete" data-comment="${key}"></i><i class="fas fa-edit edit" data-comment="${key}"></i></div></div></div></div></div>`
		}
		containerComment.innerHTML = result;
		// si hay contenido entonces recorro nodeList con icono trash
		if (result !== '') {
			const elementsToEdit = document.getElementsByClassName('edit');
			for (let i = 0; i < elementsToEdit.length; i ++) {
				elementsToEdit[i].addEventListener('click', editComment);
			}
			
			const elementsToDelete = document.getElementsByClassName('delete');
			for (let i = 0; i < elementsToDelete.length; i ++) {
				elementsToDelete[i].addEventListener('click', deleteComment);
			}
		}
	})
};

//editar comentarios

const editComment = () => {
	var keyCommentToEdit = event.target.getAttribute('data-comment');
	referenceCommentToEdit = firebase.database().ref().child('comentarios').child(keyCommentToEdit);
	referenceCommentToEdit.once('value', (snap) => {
		document.getElementById('comment').value = snap.val().comment;
	});
	console.log(document.getElementById('btn-add').textContent)
	document.getElementById('btn-add').textContent = edit;
	mood = edit;
}

// borrar comentarios
const deleteComment = () => {
	var keyCommentToDelete = event.target.getAttribute('data-comment');
	var referenceCommentToDelete = firebase.database().ref().child('comentarios').child(keyCommentToDelete);
	referenceCommentToDelete.remove();
}

// subir imagenes


const upload = () => {
	var imagenASubir = document.getElementById('files').files[0];
	var imagenesStorageRef = firebase.storage().ref();
	var uploadTask = imagenesStorageRef.child('imagenes/' + imagenASubir.name).put(imagenASubir);
	
	uploadTask.on('state_changed', function(snapshot){
		// progreso de la subida
	}, function(error) {
		// gestionar error
	}, function() {
		// cuando se ha subido todo ok
		uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log(downloadURL);
			crearNodoEnBDFirebase(imagenASubir.name, downloadURL);
		});
	});
}

const mostrarImagenesFirebase = () => {
	var imagenesFBRef = firebase.database().ref().child('imagenesFB');
	imagenesFBRef.on('value', function(snapshot){
		var datos = snapshot.val();
		var result = '';
		for (let key in datos) {
			result += `<div class="card"><div class="row"><div class="col-xs-3"><a href="#profile" title="Profile"><img src="static/img/grumpy.jpg" class="img-circle img-user" alt="User"></a></div><div class="col-xs-9"><div class="comment"><h5><a href="#profile" title="Profile">Grumpy:</a></h5><img src="${datos[key].url}"/><div><i class="fas fa-heart"></i></div></div></div></div></div>`
		}
		containerImage.innerHTML += result;
	})
}

const crearNodoEnBDFirebase = (nombreImagen, downloadURL) => {
	var imagenesFBRef = firebase.database().ref().child('imagenesFB');
	imagenesFBRef.push({
		nombre: nombreImagen,
		url: downloadURL
	})
}