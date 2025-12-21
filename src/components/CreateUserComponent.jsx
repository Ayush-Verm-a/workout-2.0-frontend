import { useState } from "react";
import UserService from "../services/UserService";

const CreateUserComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createUser = (e) => {
    e.preventDefault();

    let user = { name: name, email: email };

    UserService.createUser(user)
      .then(() => {
        console.log("User Created");
      })
      .catch((error) => {
        console.log(error.response);
      });

      setName("");
      setEmail("");
  };

  return (
    <div>
      <form>
        <label htmlFor="">Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="">Email: </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={createUser}>Create User</button>
      </form>
    </div>
  );
};

export default CreateUserComponent;
