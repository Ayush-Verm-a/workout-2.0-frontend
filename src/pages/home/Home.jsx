import React, {useEffect, useState} from "react";
import ListUserComponent from "../../components/ListUserComponent";
import CreateUserComponent from "../../components/CreateUserComponent";

const Home = () => {
    const [message, setMessage] = useState("Loading...");
    const [toggle, setToggle] = useState(false);

    return(
        <div className="home__container">
            <h1>App</h1>
            <div>
                <CreateUserComponent />
            </div>
            <div>
                <button onClick={() => setToggle(!toggle)}>Toggle User List</button>
                {toggle && <ListUserComponent />}
            </div>
        </div>
    )
}

export default Home