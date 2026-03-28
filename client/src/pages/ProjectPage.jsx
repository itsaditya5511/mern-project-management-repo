import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function ProjectPage() {
  const { id } = useParams(); // workspaceId
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [myRole, setMyRole] = useState("");

  const navigate = useNavigate();
  const { darkMode, user } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      fetchProjects();
      fetchMyRole();
    }
  }, [id]);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProjects(res.data);
    } catch (err) {
      console.error("FETCH PROJECT ERROR:", err.response?.data || err);
    }
  };

  const fetchMyRole = async () => {
    try {
      const res = await API.get(`/workspace/${id}/members`);

      const me = res.data.find(
        (m) => m.userId?._id === user?._id || m.email === user?.email
      );

      setMyRole(me?.role || "");
    } catch (err) {
      console.error("ROLE FETCH ERROR:", err.response?.data || err);
    }
  };

  const createProject = async () => {
    if (myRole === "member") {
      return alert("Only Admin or Manager can create projects");
    }

    if (!name.trim()) return alert("Enter project name");

    try {
      setLoading(true);

      await API.post("/projects", {
        name,
        workspaceId: id,
      });

      setName("");
      fetchProjects();
    } catch (err) {
      console.error("CREATE PROJECT ERROR:", err.response?.data || err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container-fluid p-4">
          {/* HEADER */}
          <div className="mb-4">
            <h2 className="fw-bold">🚀 Projects Workspace</h2>
            <p className="text-muted">
              Create and manage your projects efficiently
            </p>
          </div>

          {/* CREATE PROJECT */}
          {myRole !== "member" ? (
            <div className="card p-3 mb-4 shadow-sm">
              <div className="row g-2">
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter project name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-md-3 d-grid">
                  <button
                    className="btn btn-primary fw-bold"
                    onClick={createProject}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "+ Create"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              ⚠️ You don’t have permission to create projects
            </div>
          )}

          {/* PROJECT GRID */}
          <div className="row">
            {projects.map((p, index) => (
              <div key={p._id} className="col-md-4 mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/kanban/${p._id}`)}
                >
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{p.name}</h5>
                    <p className="text-muted">
                      Click to manage tasks →
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {projects.length === 0 && (
            <div className="text-center mt-5">
              <h4>No Projects Yet 😅</h4>
              <p className="text-muted">
                Create your first project to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}