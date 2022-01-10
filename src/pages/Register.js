import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../firebase";
import logo from './../assets/delivery.png';
import "./Register.css";

function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState("Client");
	const [user, loading, error] = useAuthState(auth);
	const history = useHistory();
	const register = () => {
		if (!name) {
			alert("Please enter name");
			return;
		}
		registerWithEmailAndPassword(name, role, email, password);
	};

	useEffect(() => {
		if (loading) {
			return (
				<div>
				  <p>Initialising User...</p>
				</div>
			  );
		}
		if (error) {
			return (
			  <div>
				<p>Error: {error}</p>
			  </div>
			);
		}
		if (user) {
			history.replace("/dashboard");
		}
	}, [user, loading, error]);

	return (
	<div className="register">
		<div className="register__container">
			<div >
				<img src={logo} alt="TransNG Logo" width="64px" height="64px" />
				<p style={{ fontSize: '24px', fontWeight: 'bold' }} >TransNG</p>
			</div>
			<input type="text" className="register__textBox" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
			<input type="text" className="register__textBox" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail Address"/>
			<input type="password" className="register__textBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
			<label>Choose a role:</label>
			<select defaultValue="Client" className="register__textBox" onChange={(e) => setRole(e.target.value)}>
				<option value="Client">Client</option>
				<option value="Carrier">Carrier</option>
			</select>
			<button className="register__btn" onClick={register}>Register</button>
			<div>Already have an account? <Link to="/">Login</Link> now.</div>
		</div>
	</div>
	);
}

export default Register;