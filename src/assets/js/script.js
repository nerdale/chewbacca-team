const container = document.getElementById('root');
const containerLogin = document.getElementById('log');

window.onload = () => {
	// inicializo firebase
	var config = {
    apiKey: "AIzaSyB5VGUJtLOPuyrYmVKXNOO9JWw5sNhRX6k",
    authDomain: "socialnetwork-79af6.firebaseapp.com",
    databaseURL: "https://socialnetwork-79af6.firebaseio.com",
    projectId: "socialnetwork-79af6",
    storageBucket: "",
    messagingSenderId: "723320283252"
  };
	firebase.initializeApp(config);

	// iniciar sesión con google firebase al clickear botón
	document.getElementById('botonlogin').addEventListener('click', (event) => { 
		let base_provider = new firebase.auth.GoogleAuthProvider();
		base_provider.addScope('email');
		firebase.auth().signInWithPopup(base_provider)
		.then(result => {
			console.log(result);
			console.log('Succes... Google Account Linked ', result.additionalUserInfo.profile.name);
		}).catch(err => {
			console.log(err);
			console.log('Failed to do ', err);
		})
	})
	
	// cerrar sesión con google firebase al clickear botón
	document.getElementById('botonlogout').addEventListener('click', (event) => {
		firebase.auth().signOut();
		container.innerHTML = ''; // se limpia div con los comentarios
		containerLogin.style.display = 'block'; // re aparece botón login
	});
	
	// verifica si la sesión está iniciada
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			//console.log('AuthStateChanged', user);
			document.getElementById('botonlogin').style.display = 'none'
			document.getElementById('botonlogout').style.display = 'block';
			showComment(user);
			add();
			show();
		} else {
			document.getElementById('botonlogin').style.display = 'block'
			document.getElementById('botonlogout').style.display = 'none';
			//swal('Hey Psssss', '...you must log in');
		}
	});
}

// mostrar textarea para agregar comentario
const showComment = (user) => {
	console.log(user.displayName)
	containerLogin.style.display = 'none';
	container.innerHTML += `<section><h2>${user.displayName}</h2><div class="container-fluid"><div id="contenedor">}</div><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="form-group text-center"><textarea class="txt" id="comment" placeholder="Comment..."></textarea><button type="button" class="btn btn-primary pull-right" id="btn-add" onclick="add()"><i class="fas fa-plus"></i> Add comment</button></div></div></div></div></section>`
};

const add = (event) => {
	// muestra los comentarios guardados en firebase
	show();
	if (document.getElementById('comment').value.length === 0) {
		console.log('mensaje vacio')
		return;
	}
	// referencia al nodo raiz de la base de datos (comentarios) para crearle hijos
	const databaseRef = firebase.database().ref().child('comentarios');
	// agrega comentarios a database firebase
	databaseRef.push({
		comment: document.getElementById('comment').value
	});	
	document.getElementById('comment').value = '';
};

const show = () => {
	const containerComment = document.getElementById('contenedor');
	firebase.database().ref().child('comentarios').on('value', (snap) => {
		var datos = snap.val();
		let result = '';
		console.log(datos)
		for (var key in datos) {
			result += `<div class="card"><div class="row"><div class="col-xs-3"><a href="#profile" title="Profile"><img src="static/img/grumpy.jpg" class="img-circle img-user" alt="User"></a></div><div class="col-xs-9"><div class="comment"><h5><a href="#profile" title="Profile">Grumpy:</a></h5><p>${datos[key].comment}</p><div><i class="fas fa-heart"></i></div></div></div></div></div>`
		}
		containerComment.innerHTML = result;
	})
};
