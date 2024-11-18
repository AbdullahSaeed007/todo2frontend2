import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/v1/admin/users",
          { withCredentials: true }
        );

        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:9000/api/v1/admin/user/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
      console.log(`User with ID: ${userId} deleted`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setEditedUser({ ...user });
  };

  const handleSaveUser = async () => {
    try {
      const { _id, username, email, role } = editedUser;
      await axios.put(
        `http://localhost:9000/api/v1/admin/user/${_id}`,
        {
          username,
          email,
          role,
        },
        { withCredentials: true }
      );
      setUsers(users.map((user) => (user._id === _id ? editedUser : user)));
      setEditingUserId(null);
      console.log("User updated:", editedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlePermissionChange = async (userId, permission, checked) => {
    const currentPermissions =
      editedUser && editedUser._id === userId
        ? editedUser.permissions
        : users.find((user) => user._id === userId).permissions;

    const updatedPermissions = checked
      ? [...currentPermissions, permission]
      : currentPermissions.filter((p) => p !== permission);

    try {
      const response = await axios.put(
        `http://localhost:9000/api/v1/admin/permissions/${userId}`,
        { permissions: updatedPermissions },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId
              ? { ...user, permissions: updatedPermissions }
              : user
          )
        );
        if (editingUserId === userId) {
          setEditedUser({ ...editedUser, permissions: updatedPermissions });
        }
        console.log("Permissions updated:", updatedPermissions);
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div style={{ padding: "2em" }}>
      <h2>User Management</h2>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Read</th>
            <th>Write</th>
            <th>Update</th>
            <th>Delete</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={editedUser.username}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, username: e.target.value })
                    }
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <select
                    value={editedUser.role}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              {["read", "write", "update", "delete"].map((permission) => (
                <td key={permission}>
                  <input
                    type="checkbox"
                    checked={user.permissions.includes(permission)}
                    onChange={(e) =>
                      handlePermissionChange(
                        user._id,
                        permission,
                        e.target.checked
                      )
                    }
                  />
                </td>
              ))}
              <td>
                {editingUserId === user._id ? (
                  <button onClick={handleSaveUser}>Save</button>
                ) : (
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                )}
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
