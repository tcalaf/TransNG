import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, db, logout } from "../firebase";

function Dashboard() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();

	const fetchData = useCallback(async () => {
		try {
			const query = await db.collection("users").where("uid", "==", user?.uid).get();
			const data = query.docs[0].data();
			setName(data.name);
			setRole(data.role);
		} catch (err) {
			console.error(err);
			alert("An error occured while fetching user data");
		}
	},[user?.uid]);

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
		if (!user) {
			return history.replace("/");
		}
		fetchData();
	}, [user, loading, error, history, fetchData]);

	return (
		<div className="dashboard">
			<div className="dashboard__container">Logged in as
				<div>{name}</div>
				<div>{role}</div>
				<div>{user?.email}</div>
				<button className="dashboard__btn" onClick={logout}>Logout</button>
			</div>
		</div>
	);
}
export default Dashboard;