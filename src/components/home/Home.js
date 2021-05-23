import { BASE_URL } from "../constans/api";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Login from "../login/Login";

function Home() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchPages() {
      try {
        const response = await axios.get(BASE_URL + "wp/v2/pages");
        console.log("response", response.data);
        setPages(response.data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occured: {error}</div>;
  }

  return (
    <Container>
      <div className="items ">
        <div className="text-center heading-home row">
          <Login />
        </div>
        <div className="row admin">
          <ul>
            {pages.map(function (page) {
              console.log(page);
              return (
                <li key={page.id}>
                  <Link to={`/Page/${page.id}`} className="link">
                    {page.title.rendered}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Container>
  );
}
export default Home;
