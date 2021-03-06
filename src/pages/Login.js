import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from './../assets/delivery.png';
import "./Login.css";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, loading, error] = useAuthState(auth);
	const history = useHistory();

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
		<div className="login">
			<div className="login__container">
				<div >
					<img src={logo} alt="TransNG Logo" width="64px" height="64px" />
					<p style={{ fontSize: '24px', fontWeight: 'bold' }} >TransNG</p>
				</div>
				<input type="text" className="login__textBox" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail Address" />
				<input type="password" className="login__textBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
				<button className="login__btn" onClick={() => signInWithEmailAndPassword(email, password)}>Login</button>
				<div><Link to="/reset">Forgot Password</Link></div>
				<div>Don't have an account? <Link to="/register">Register</Link> now.</div>
			</div>
		</div>
	);
}

export default Login;