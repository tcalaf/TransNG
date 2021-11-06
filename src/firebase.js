import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDKJGv55yVqkXyG-T1hcwisFcZBA0P1Jl0",
	authDomain: "transng-31824.firebaseapp.com",
	projectId: "transng-31824",
	storageBucket: "transng-31824.appspot.com",
	messagingSenderId: "300577165654",
	appId: "1:300577165654:web:ec3201596e0b230352c6f7",
	measurementId: "G-V4ZSE0E60K"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();


const signInWithEmailAndPassword = async (email, password) => {
	try {
		await auth.signInWithEmailAndPassword(email, password);
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const registerWithEmailAndPassword = async (name, role, email, password) => {
	try {
		const res = await auth.createUserWithEmailAndPassword(email, password);
		const user = res.user;
		await db.collection("users").doc(user.uid).set(
			{
				uid: user.uid,
				name,
				role,
				email,
			}	
		);
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const sendPasswordResetEmail = async (email) => {
	try {
		await auth.sendPasswordResetEmail(email);
		alert("Password reset link sent!");
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const logout = () => {
	auth.signOut();
};

export {
	auth,
	db,
	signInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordResetEmail,
	logout,
};