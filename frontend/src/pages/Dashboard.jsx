import { useEffect, useState } from "react";
import AddLinkForm from "../componentes/addlinkform";
import LinksTable from "../componentes/linkstable";
import { getLinks } from "../api";

export default function Dashboard() {
  const [links, setLinks] = useState([]);

  const loadLinks = async () => {
    const data = await getLinks();
    setLinks(data);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="container">
      <h1>TinyLink Dashboard</h1>

      <AddLinkForm onSuccess={loadLinks} />

      <LinksTable links={links} onDelete={loadLinks} />
    </div>
  );
}
