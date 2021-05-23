import { BASE_URL } from "../constans/api";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

function Page() {
  const [page, setPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchPage(id) {
      try {
        const response = await axios.get(BASE_URL + "wp/v2/pages/" + id);
        console.log("response", response.data);
        setPage(response.data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }
    let page_id = window.location.pathname.split("/").pop();
    fetchPage(page_id);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occured: {error}</div>;
  }
  let formatted_date = moment(page.date).format("DD MMMM YYYY");
  console.log(formatted_date);

  function createMarkup() {
    return { __html: page.excerpt.rendered };
  }
  return (
    <Container>
      <div className="row">
        <div className="col-12">
          <h1>{page.title.rendered}</h1>
          <p>{"Page date : " + formatted_date}</p>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
      </div>
    </Container>
  );
}
export default Page;
