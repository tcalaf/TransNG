import React, { useEffect, useState } from 'react';
import { auth, db, logout } from "./../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";

function ViewDemands() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const history = useHistory();

    const [demands, setDemands] = useState([]);

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
		async function fetchData() {
			try {
				const userRef = db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);               

				console.log(data.name);

                const clientsRef = db.collection("users").where("role", "==", "Client");
                const clientsSnap = await clientsRef.get();
				const allClients = clientsSnap.docs.map(clientDoc => clientDoc.data());    

                let allDemands = [];

                for (let i = 0; i < allClients.length; i++) {
                    const demandsCollectionRef = db.collection("users").doc(allClients[i].uid).collection("demands");
                    const demandsCollectionSnap = await demandsCollectionRef.get();
                    const allCollectionDemands = demandsCollectionSnap.docs.map(demandDoc => ({
                        ...demandDoc.data(),
                        id: demandDoc.id,
                    }));

                    if (allCollectionDemands.length > 0) {
                        for (let j = 0; j < allCollectionDemands.length; j++) {
                            let newDemand = {
                                ...allCollectionDemands[j],
                                uid: allClients[i].uid,
                            };
                            allDemands.push(newDemand);
                        }
                    }
                }
                
                console.log(allDemands);
                setDemands(allDemands);

			} catch (err) {
				console.error(err);
				//alert("An error occured while fetching user data");
			}			
		}
		fetchData();
	}, [user, loading, error]);

  return <div></div>;
}

export default ViewDemands;
