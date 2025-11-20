import { Link } from "react-router-dom";
import { deleteLink } from "../api";
import "./LinksTable.css";

export default function LinksTable({ links, onDelete }) {
  const handleDelete = async (code) => {
    await deleteLink(code);
    onDelete();
  };

  if (!links || links.length === 0) {
    return <p className="no-links">No links yet.</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Target URL</th>
            <th>Total Clicks</th>
            <th>Last Clicked</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => (
            <tr key={link.code}>
              <td>
                <Link to={`/code/${link.code}`} className="code-link">
                  {link.code}
                </Link>
              </td>
              <td className="truncate">{link.target_url}</td>
              <td>{link.clicks}</td>
              <td>{link.last_clicked || "—"}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(link.code)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
