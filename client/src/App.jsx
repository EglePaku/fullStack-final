import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import "./App.css";

const App = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/")
      .then((resp) => resp.data)
      .then((response) => {
        setCars(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="wrapper">
      <aside className="aside-wrap">
        <Formik
          initialValues={{ brand: "", model: "" }}
          onSubmit={(values) => {
            const newCar = values;
            axios
              .post("http://localhost:3000/", newCar)
              .then(() => {
                setCars((prevCars) => [...prevCars, newCar]);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          {/* add styles */}
          <Form className="custom-form">
            <h1 className="logo">Quipsa</h1>
            <div className="form-wrap">
              <h1>Nori užduoti klausimą?</h1>
              <Field name="brand" placeholder="Tavo klausimas..." />
              <Field name="model" placeholder="Aprašymas..." />
              <button type="submit">Užduoti naują klausimą</button>
            </div>
            <span className="placeholder-invisible"></span>
          </Form>
        </Formik>
      </aside>

      <main>
        <div className="header">
          <h2>Mano klausimai</h2>
        </div>

        <div className="content-wrap">
          <div className="list">
            {cars.map((car) => (
              <div key={car._id} className="list-item">
                <div className="list-item-content">
                  <h3>{car.brand}</h3>
                  <p>{car.model}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
