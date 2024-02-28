import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [images, setImages] = useState([]);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [doctorsAdvice, setDoctorsAdvice] = useState("");
  const [diagonosis, setDiagonosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");

  const handleDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      original: URL.createObjectURL(file),
      file,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemove = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^01\d{9}$/;
    return regex.test(phoneNumber);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("user_phone", phone);
    formData.append("description", description);
    formData.append("doctor_advice", doctorsAdvice);
    formData.append("diagonosis", diagonosis);
    formData.append("treatment", treatment);
    formData.append("disease", selectedDisease);

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    if (!phone || !description || !doctorsAdvice || !diagonosis || !treatment || !selectedDisease) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Invalid phone number");
      return;
    }

    axios
      .post("api/", formData)
      .then((response) => {
        setImages([]);
        setPhone("");
        setDescription("");
        setDoctorsAdvice("");
        setDiagonosis("");
        setTreatment("");
        setSelectedDisease("");
        toast.success(response.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.data);
      });
  };

  const handleRadioChange = (event) => {
    setSelectedDisease(event.target.value);
  };

  useEffect(() => {
    axios
      .get("diseases/")
      .then((response) => {
        setDiseases(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const thumbnailStyles = {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    marginRight: "10px",
  };

  return (
    <div className="App">
      <ToastContainer />
      <div className="container mt-3">
        <div className="mb-5 text-center">
          <h1>Cattle Disease Prediction</h1>
        </div>
        <div>
          <div className="mb-3">
            <h5 className="form-label">Phone</h5>
            <input type="text" className="form-control" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="mb-3">
            <h5 className="form-label">Description</h5>
            <textarea placeholder="Description" cols="40" rows="5" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="mb-3">
            <h5 className="form-label">Doctor's advice</h5>
            <textarea placeholder="Doctor's advice" cols="40" rows="5" className="form-control" value={doctorsAdvice} onChange={(e) => setDoctorsAdvice(e.target.value)}></textarea>
          </div>
          <div className="mb-3">
            <h5 className="form-label">Diagonosis</h5>
            <textarea placeholder="Diagonosis" cols="40" rows="5" className="form-control" value={diagonosis} onChange={(e) => setDiagonosis(e.target.value)}></textarea>
          </div>
          <div className="mb-3">
            <h5 className="form-label">Treatment</h5>
            <textarea placeholder="Treatment" cols="40" rows="5" className="form-control" value={treatment} onChange={(e) => setTreatment(e.target.value)}></textarea>
          </div>
          <div className="mb-3">
            <h5 className="form-label">Diseases</h5>
            {diseases &&
              diseases.map((disease) => (
                <div className="form-check" key={disease.id}>
                  <input className="form-check-input" type="radio" name="diseaseRadio" id={`diseaseRadio${disease.id + 1}`} value={disease.id} onChange={handleRadioChange} />
                  <label className="form-check-label" htmlFor={`diseaseRadio${disease.id + 1}`}>
                    {disease.name}
                  </label>
                </div>
              ))}
          </div>
          <div className="mb-3">
            <h5 className="form-label">Images</h5>
            <div className="container d-flex justify-content-center align-items-center">
              <div className="text-center m-3">
                <Dropzone onDrop={handleDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()} style={dropzoneStyles}>
                        <input {...getInputProps()} />
                        <p>Drag and drop some files here, or click to select files</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
                <div className="mt-3"></div>
                {images.length > 0 && (
                  <div className="mt-3">
                    <h5>Selected Images:</h5>
                    <div className="row justify-content-center">
                      {images.map((image, index) => (
                        <div className="col-md-3" key={index}>
                          <div className="m-3">
                            <img src={image.original} alt={`Preview ${index + 1}`} style={thumbnailStyles} className="img-fluid" />
                            <button className="btn btn-danger mt-2" onClick={() => handleRemove(index)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mb-3">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default App;
