import React, { useEffect, useState } from "react";
import AddWorkoutComponent from "../../components/AddWorkoutComponent";

const Home = () => {
    const [toggle, setToggle] = useState(false);

    return (
        <div className="home__container">
            <h1>Home</h1>
            <h3>Site Description</h3>
            <h3>Site Feature Cards</h3>
        </div>
    );
};

export default Home;
