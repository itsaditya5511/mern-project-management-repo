import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [myRole, setMyRole] = useState(""); // 🔥 NEW

  const navigate = useNavigate();
  const { darkMode, user } = useContext(AuthContext);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const res = await API.get("/workspace");
    setWorkspaces(res.data);
  };

  const createWorkspace = async () => {
    if (!name) return alert("Enter workspace name");
    await API.post("/workspace", { name });
    setName("");
    fetchWorkspaces();
  };

  // ================================
  // 👥 OPEN MEMBERS + DETECT ROLE
  // ================================
  const openMembers = async (workspace) => {
    setSelectedWorkspace(workspace);

    const res = await API.get(`/workspace/${workspace._id}/members`);
    setMembers(res.data);

    // 🔥 FIND MY ROLE
    const me = res.data.find(
      (m) => m.userId?._id === user?._id || m.email === user?.email
    );

    setMyRole(me?.role || "");
  };

  const invite = async () => {
    if (myRole !== "admin") return alert("Only admin can invite");

    await API.post(`/workspace/${selectedWorkspace._id}/invite`, {
      email,
      role,
    });

    setEmail("");
    openMembers(selectedWorkspace);
  };

  const updateRole = async (memberId, role) => {
    if (myRole !== "admin") return;

    await API.put(`/workspace/${selectedWorkspace._id}/role`, {
      memberId,
      role,
    });

    openMembers(selectedWorkspace);
  };

  const removeMember = async (memberId) => {
    if (myRole !== "admin") return;

    await API.delete(`/workspace/${selectedWorkspace._id}/member`, {
      data: { memberId },
    });

    openMembers(selectedWorkspace);
  };

  return (
    <div className={darkMode ? "bg-dark text-light" : "bg-light"}>
      <div className="d-flex">
        <Sidebar />

        <div className="flex-grow-1">
          <Navbar />

          <div className="container py-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold">🚀 Workspaces</h2>
                <p className="text-muted">Manage your projects efficiently</p>
              </div>

              {/* ✅ Only Admin can create workspace */}
              {user?.role === "admin" && (
                <div className="d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="New Workspace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={createWorkspace}
                  >
                    + Create
                  </button>
                </div>
              )}
            </div>

            {/* WORKSPACE GRID */}
            <div className="row">
              {workspaces.map((w) => (
                <div key={w._id} className="col-md-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="card shadow border-0 h-100"
                    style={{
                      borderRadius: "15px",
                      background: darkMode
                        ? "rgba(255,255,255,0.05)"
                        : "#ffffff",
                    }}
                  >
                    <div className="card-body">
                      <h5 className="fw-bold">{w.name}</h5>

                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/project/${w._id}`)}
                        >
                          Open
                        </button>

                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => openMembers(w)}
                        >
                          Members
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* ================================
                👥 MEMBERS MODAL
            ================================ */}
            {selectedWorkspace && (
              <div className="modal d-block">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content shadow">

                    <div className="modal-header">
                      <h5>
                        👥 Members - {selectedWorkspace.name}
                      </h5>
                      <button
                        className="btn-close"
                        onClick={() => setSelectedWorkspace(null)}
                      />
                    </div>

                    <div className="modal-body">

                      {/* ✅ ONLY ADMIN CAN INVITE */}
                      {myRole === "admin" && (
                        <div className="d-flex gap-2 mb-3">
                          <input
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />

                          <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="member">Member</option>
                          </select>

                          <button className="btn btn-success" onClick={invite}>
                            Invite
                          </button>
                        </div>
                      )}

                      {/* TABLE */}
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {members.map((m, i) => (
                            <tr key={i}>
                              <td>{m.email}</td>

                              <td>
                                {/* ✅ ONLY ADMIN CAN CHANGE ROLE */}
                                {myRole === "admin" ? (
                                  <select
                                    className="form-select form-select-sm"
                                    value={m.role}
                                    onChange={(e) =>
                                      updateRole(m.userId, e.target.value)
                                    }
                                  >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="member">Member</option>
                                  </select>
                                ) : (
                                  m.role
                                )}
                              </td>

                              <td>
                                {/* ✅ ONLY ADMIN CAN REMOVE */}
                                {myRole === "admin" && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeMember(m.userId)}
                                  >
                                    Remove
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}