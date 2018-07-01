window.onload = () => {
	var config = {
    apiKey: "AIzaSyB5VGUJtLOPuyrYmVKXNOO9JWw5sNhRX6k",
    authDomain: "socialnetwork-79af6.firebaseapp.com",
    databaseURL: "https://socialnetwork-79af6.firebaseio.com",
    projectId: "socialnetwork-79af6",
    storageBucket: "",
    messagingSenderId: "723320283252"
  };
	firebase.initializeApp(config);
}

const googleSignIn = () => {
	base_provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(base_provider).then(result => {
		console.log(result);
		console.log('Succes... Google Account Linked');
		showComment(result);
		
	}).catch(err => {
		console.log(err);
		console.log('Failed to do');
	})
}


const showComment = (result) => {
	const container = document.getElementById('root');
	document.getElementById('log').style.display = 'none';
	container.innerHTML = `	<section><div class="container-fluid"><div id="contenedor"></div><div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="form-group text-center"><textarea class="txt" id="comment" placeholder="Comment..."></textarea><button type="button" class="btn btn-primary pull-right" id="btn-add" onclick="add()"><i class="fas fa-plus"></i> Add comment</button></div></div></div></div></section>`
}

const add = (event) => {
	var cont = document.getElementById('contenedor');
	// referencia al nodo raiz de la base de datos
	var databaseRef = firebase.database().ref().child('comentarios');	
	databaseRef.push({
		comment: document.getElementById('comment').value
		//event.target.comment.value
	})

	var comment = document.getElementById('comment').value;
	document.getElementById('comment').value = '';
	
	if (comment === null || comment.length === 0) {
		swal('Hey Psssss', '...where is the comment?');
		return false;
	}



	cont.innerHTML += `<div class="card"><div class="row"><div class="col-xs-3"><a href="#profile" title="Profile"><img src="img/grumpy.jpg" class="img-circle img-user" alt="User"></a></div><div class="col-xs-9"><div class="comment"><h5><a href="#profile" title="Profile">Grumpy:</a></h5><p>${comment}</p><div><i class="fas fa-heart"></i></div></div></div></div></div>`

}
