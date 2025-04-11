import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Check, X, Filter, MoreHorizontal, ArrowLeft } from 'lucide-react';
import './Admin.css';

function WorkoraAdminDashboard() {
  const navigate = useNavigate();

  const [freelancers, setFreelancers] = useState([
    { id: 1, name: "Sarah Johnson", expertise: "Web Development", experience: "5 years", status: "Pending" },
    { id: 2, name: "Michael Chen", expertise: "UX/UI Design", experience: "3 years", status: "Pending" },
    { id: 3, name: "Olivia Rodriguez", expertise: "Mobile Development", experience: "4 years", status: "Pending" },
    { id: 4, name: "James Wilson", expertise: "Data Science", experience: "6 years", status: "Pending" },
    { id: 5, name: "Emma Thompson", expertise: "Content Writing", experience: "2 years", status: "Pending" },
  ]);

  const handleApprove = (id) => {
    setFreelancers(freelancers.map(f =>
      f.id === id ? { ...f, status: "Approved" } : f
    ));
  };

  const handleReject = (id) => {
    setFreelancers(freelancers.map(f =>
      f.id === id ? { ...f, status: "Rejected" } : f
    ));
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <h1 className="header-title">Admin Dashboard</h1>

        <div className="header-right">
          <img 
            src="src/assets/logo.jpg" 
            alt="Workora Logo" 
            className="logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="section-title">Freelancer Approval</h2>
            <div className="header-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search freelancers..."
                  className="search-input"
                />
                <Search className="search-icon" />
              </div>
              <button className="filter-button">
                <Filter className="filter-icon" />
                Filter
                <ChevronDown className="dropdown-icon" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="freelancers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Expertise</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {freelancers.map((freelancer) => (
                  <tr key={freelancer.id}>
                    <td>
                      <div className="freelancer-info">
                        <div className="avatar">
                          {freelancer.name.charAt(0)}
                        </div>
                        <div className="name">{freelancer.name}</div>
                      </div>
                    </td>
                    <td>{freelancer.expertise}</td>
                    <td>{freelancer.experience}</td>
                    <td>
                      <span className={`status-badge ${freelancer.status.toLowerCase()}`}>
                        {freelancer.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleApprove(freelancer.id)}
                          disabled={freelancer.status !== "Pending"}
                          className={`action-button approve ${freelancer.status !== "Pending" ? "disabled" : ""}`}
                        >
                          <Check />
                        </button>
                        <button
                          onClick={() => handleReject(freelancer.id)}
                          disabled={freelancer.status !== "Pending"}
                          className={`action-button reject ${freelancer.status !== "Pending" ? "disabled" : ""}`}
                        >
                          <X />
                        </button>
                        <button className="action-button more">
                          <MoreHorizontal />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              Showing <span className="bold">1</span> to <span className="bold">5</span> of <span className="bold">5</span> results
            </div>
            <div className="pagination-controls">
              <button className="pagination-button">Previous</button>
              <button className="pagination-button">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WorkoraAdminDashboard;
