import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './clientdash.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  // Mock data for projects
  const projects = [
    { id: 1, title: 'Website Redesign', freelancer: 'Alex Johnson', status: 'In Progress', dueDate: '2025-05-15' },
    { id: 2, title: 'Mobile App Development', freelancer: 'Sarah Williams', status: 'Not Started', dueDate: '2025-06-20' },
    { id: 3, title: 'SEO Optimization', freelancer: 'Mike Chen', status: 'Completed', dueDate: '2025-04-05' },
  ];

  // Mock data for messages
  const messages = [
    { id: 1, sender: 'Alex Johnson', preview: 'I\'ve updated the wireframes for...', time: '10:30 AM', unread: true },
    { id: 2, sender: 'Sarah Williams', preview: 'Could we schedule a call to discuss...', time: 'Yesterday', unread: false },
    { id: 3, sender: 'Support Team', preview: 'Your payment was successfully processed...', time: 'Apr 9', unread: false },
  ];

  // Mock data for invoices
  const invoices = [
    { id: 1, project: 'Website Redesign', amount: '$2,500', date: '2025-04-01', status: 'Paid' },
    { id: 2, project: 'Mobile App Development', amount: '$5,000', date: '2025-04-15', status: 'Pending' },
    { id: 3, project: 'SEO Optimization', amount: '$1,200', date: '2025-03-20', status: 'Paid' },
  ];

  return (
    <div className="client-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2>FreelanceHub</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
              <span className="icon">📁</span>
              <span className="nav-text">Projects</span>
            </li>
            <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
              <span className="icon">💬</span>
              <span className="nav-text">Messages</span>
              <span className="badge">2</span>
            </li>
            <li className={activeTab === 'invoices' ? 'active' : ''} onClick={() => setActiveTab('invoices')}>
              <span className="icon">📄</span>
              <span className="nav-text">Invoices</span>
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
              <span className="icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </li>
          </ul>
        </nav>
        <div className="user-profile">
          <div className="avatar">JS</div>
          <div className="user-info">
            <p className="user-name">John Smith</p>
            <p className="user-role">Client</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1 className="page-title">
            {activeTab === 'projects' && 'My Projects'}
            {activeTab === 'messages' && 'Messages'}
            {activeTab === 'invoices' && 'Invoices'}
            {activeTab === 'settings' && 'Account Settings'}
          </h1>
          <div className="header-actions">
            <div className="search-container">
              <input type="text" className="search-input" placeholder="Search..." />
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <button className="action-button">
              {activeTab === 'projects' && '+ New Project'}
              {activeTab === 'messages' && '+ New Message'}
              {activeTab === 'invoices' && 'View All'}
              {activeTab === 'settings' && 'Save Changes'}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="projects-container">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Project Title</th>
                    <th>Freelancer</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.freelancer}</td>
                      <td>
                        <span className={`status-badge ${project.status.replace(/\s+/g, '-').toLowerCase()}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>{project.dueDate}</td>
                      <td>
                        <button className="view-button">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="messages-container">
              <ul className="messages-list">
                {messages.map(message => (
                  <li key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
                    <div className="message-avatar">{message.sender.charAt(0)}</div>
                    <div className="message-content">
                      <div className="message-header">
                        <h4 className="message-sender">{message.sender}</h4>
                        <span className="message-time">{message.time}</span>
                      </div>
                      <p className="message-preview">{message.preview}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="invoices-container">
              <table className="invoices-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.project}</td>
                      <td>{invoice.amount}</td>
                      <td>{invoice.date}</td>
                      <td>
                        <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-button">View Invoice</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-container">
              <div className="settings-panel">
                <div className="setting-group">
                  <h3 className="setting-title">Profile Information</h3>
                  <div className="setting-fields">
                    <div className="field">
                      <label>Name</label>
                      <input type="text" defaultValue="John Smith" />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input type="email" defaultValue="john@example.com" />
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input type="tel" defaultValue="+1234567890" />
                    </div>
                  </div>
                </div>
                <div className="setting-group">
                  <h3 className="setting-title">Security</h3>
                  <div className="setting-fields">
                    <div className="field">
                      <label>Password</label>
                      <input type="password" defaultValue="********" />
                    </div>
                    <div className="field">
                      <label>2FA</label>
                      <select defaultValue="enabled">
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;