import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const handleDeleteCar = (carId) => {
    axios
      .delete(`http://localhost:3000/${carId}`)
      .then(() => {
        // Handle the response as needed
        // Remove the deleted car from the UI
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));

        // Show a success notification for deletion
        toast.success("Įrašas sėkmingai ištrintas");
      })
      .catch((error) => {
        console.error(error);
        // Show an error notification
        toast.error("Įvyko klaida, perkraukite puslapį");
      });
  };

  const handleUpvote = (carId) => {
    const updatedCars = cars.map((car) => {
      if (car._id === carId) {
        return { ...car, upvotes: (car.upvotes || 0) + 1 };
      }
      return car;
    });
    setCars(updatedCars);
  };

  const handleDownvote = (carId) => {
    const updatedCars = cars.map((car) => {
      if (car._id === carId) {
        return { ...car, downvotes: (car.downvotes || 0) + 1 };
      }
      return car;
    });
    setCars(updatedCars);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const addNewCar = (newCar) => {
    // Add the new car to the beginning of the list with the new-list-item class
    setCars((prevCars) => [{ ...newCar, isNew: true }, ...prevCars]);

    // Show a success notification for form submission
    toast.success("Įrašas sėkmingai pateiktas");
  };

  const handleFormSubmit = (values, { resetForm }) => {
    const newCar = values;
    axios
      .post("http://localhost:3000/", newCar)
      .then(() => {
        addNewCar(newCar);

        resetForm();

        // Scroll to the top of the page with smooth animation
        scrollToTop();
      })
      .catch((error) => {
        console.error(error);
        // Show an error notification for form submission
        toast.error("Nepavyko pateikti įrašo.");
      });
  };

  return (
    <div className="wrapper">
      <aside className="aside-wrap">
        <Formik
          initialValues={{ brand: "", model: "" }}
          onSubmit={handleFormSubmit}
        >
          <Form className="custom-form">
            <h1 className="logo">Quipsa</h1>
            <div className="form-wrap">
              <h1>Nori užduoti klausimą?</h1>
              <Field name="brand" placeholder="Tavo klausimas..." />
              <Field name="model" placeholder="Aprašymas..." />
              <button className="btn" type="submit">
                Užduoti naują klausimą
              </button>
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
              <div
                key={car._id}
                className={`list-item ${car.isNew ? "new-list-item" : ""}`}
              >
                <div className="list-item-content">
                  <h3>{car.brand}</h3>
                  <p>{car.model}</p>
                </div>
                {/* User action */}
                <div className="user-actions">
                  <div className="wrap-start">
                    <div className="cbutton thumb">
                      <img
                        src="../src/assets/icons/hand-thumbs-up.svg"
                        onClick={() => handleUpvote(car._id)}
                      />
                      <span>{car.upvotes || 0}</span>
                    </div>
                    <div className="cbutton">
                      <img
                        src="../src/assets/icons/hand-thumbs-down.svg"
                        onClick={() => handleDownvote(car._id)}
                      />
                      <span>{car.downvotes || 0}</span>
                    </div>
                  </div>
                  <div className="wrap-end">
                    <div className="cbutton">
                      <img src="../src/assets/icons/pen.svg" />
                      Redaguoti
                    </div>
                    <div
                      className="cbutton"
                      onClick={() => handleDeleteCar(car._id)}
                    >
                      <img src="../src/assets/icons/trash.svg" />
                      Ištrinti
                    </div>
                    <div className="cbutton">
                      <img src="../src/assets/icons/reply.svg" />
                      Atsakyti
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default App;
