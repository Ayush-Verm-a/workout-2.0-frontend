import { useEffect, useState } from "react";
import UserService from "../services/UserService";

const ListUserComponent = () => {
  const [users, setUsers] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    UserService.getUsers().then((res) => {
      setUsers(res.data);
      console.log(res);
    });
  }, []);

  const editUser = (e, id, name, email) => {
    e.preventDefault();
    setToggle(true);
    setId(id);
    setName(name);
    setEmail(email);
  };

  const updateDeleteUser = (e, check) => {
    e.preventDefault();
    let user = { name: name, email: email };
    if (check == 0) {
      UserService.updateUser(user, id).then((res) => {
        console.log(res);
      });
    } else {
      UserService.deleteUser(id).then((res) => {
        console.log(res);
      });
    }
    setToggle(false);
  };

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={(e) => editUser(e, user.id, user.name, user.email)}
                >
                  Edit/Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {toggle && (
          <form>
            <label htmlFor="">Name: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="">Email: </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={(e) => updateDeleteUser(e, 0)}>Update User</button>
            <button onClick={(e) => updateDeleteUser(e, 1)}>Delete User</button>
            <button onClick={() => setToggle(false)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ListUserComponent;
