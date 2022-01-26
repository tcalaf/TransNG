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
				phone: "",
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

const fetchDemandsSupplyNull = async (uid) => {
	const demandsRef = db.collection("users").doc(uid).collection("demands").where("supply", "==", null);
	const demandsSnap = await demandsRef.get();
	const allDemands = demandsSnap.docs.map(demandDoc => ({
		...demandDoc.data(),
		id: demandDoc.id,
		uid: uid
	}));
	return allDemands;
}

// Returns client's contracts
const fetchContractsClient = async (uid) => {
	const contractsRef = db.collection("contracts").where("demand.demand_uid", "==", uid);
	return fetchContracts(contractsRef);
}

// Returns carrier's contracts
const fetchContractsCarrier = async (uid) => {
	const contractsRef = db.collection("contracts").where("supply.supply_uid", "==", uid);
	return fetchContracts(contractsRef);
}

const fetchContracts = async (contractsRef) => {
	const contractsSnap = await contractsRef.get();
	const allContracts = contractsSnap.docs.map(contractDoc => ({
		...contractDoc.data(),
		id: contractDoc.id,
	}));
	return allContracts;
}

// Returns demands chosen by specified supply
const fetchDemandsforSupply = async (demandsData) => {
	let demands = [];
	for (let i = 0; i < demandsData.length; i++) {
		const demandData = demandsData[i];
		const demand = await fetchDemand(demandData.demand_uid, demandData.demand_id);
		demands.push(demand);
	}
	return demands;
}

// Returns demand
const fetchDemand = async (uid, demandID) => {
	const demandRef = db.collection("users").doc(uid).collection("demands").doc(demandID);
	const demandSnap = await demandRef.get();
	const demandData = demandSnap.data();
	return demandData;
}

// Returns truck
const fetchTruck = async (uid, truckID) => {
	const truckRef = db.collection("users").doc(uid).collection("trucks").doc(truckID);
	const truckSnap = await truckRef.get();
	const truckData = truckSnap.data();
	return truckData;
}

// Returns all supplies
const fetchSupplies = async (uid) => {
	const suppliesRef = db.collection("users").doc(uid).collection("supplies");
	const suppliesSnap = await suppliesRef.get();
	const allSupplies = suppliesSnap.docs.map(supplyDoc => ({
		...supplyDoc.data(),
		id: supplyDoc.id,
		uid: uid
	}));
	return allSupplies;
}

// Returns all carriers
const fetchCarriers = async () => {
	const carriersRef = db.collection("users").where("role", "==", "Carrier");
	const carriersSnap = await carriersRef.get();
	const allCarriers = carriersSnap.docs.map(carrierDoc => carrierDoc.data());
	return allCarriers;
}

// Returns user
const fetchUser = async (uid) => {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const data = userSnap.data();
	return data;
}

export {
	auth,
	db,
	signInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordResetEmail,
	logout,
	fetchUser,
	fetchCarriers,
	fetchSupplies,
	fetchTruck,
	fetchDemand,
	fetchDemandsforSupply,
	fetchContractsClient,
	fetchContractsCarrier,
	fetchDemandsSupplyNull,
};