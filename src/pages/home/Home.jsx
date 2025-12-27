import React, { useEffect, useState } from "react";
import AddWorkoutComponent from "../../components/AddWorkoutComponent";

const Home = () => {
    const [toggle, setToggle] = useState(false);

    return (
        <div className="home__container">
            <h1>Home</h1>
            <button onClick={() => setToggle(true)}>Add Workout</button>
            {toggle && <AddWorkoutComponent />}
        </div>
    );
};

export default Home;
