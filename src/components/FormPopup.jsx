import Button from "react-bootstrap/Button";
import { Modal, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";

const getDataList = () => {
  const data = localStorage.getItem("forms");
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

function FormPopup() {
  const [checkbox, setCheckbox] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState(getDataList());
  const [alert, setAlert] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [dataType, setDataType] = useState("text");

  var today = new Date(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

  const [form, setForm] = useState({
    formname: "",
    description: "",
    createdAt: date,
    fields: [],
  });

  const [field, setField] = useState({
    name: name,
    dataType: dataType,
    required: checkbox,
  });

  const handleFormChange = ({ currentTarget: input }) => {
    setForm({ ...form, [input.name]: input.value });
  };

  const handleFieldChange = ({ currentTarget: input }) => {
    if (input.value === "clicked") {
      setCheckbox(() => !checkbox);
      setField({ ...field, [input.name]: !checkbox });
    }
    if (input.name === "name") {
      setField({ ...field, [input.name]: input.value });
      setName(input.value);
    }
    if (input.name === "dataType") {
      setField({ ...field, [input.name]: input.value });
    }
  };

  const handleFormSubmit = (e) => {
    if (form.formname === "") {
      setAlert(1);
      return;
    }
    if (form.description === "") {
      setAlert(2);
      return;
    }
    let filteredData = data.filter((data) => data.formname === form.formname);
    if (filteredData.length > 0) {
      setAlert(5);
      return;
    }

    setData([...data, form]);
    setShow(false);
    window.location.reload(false);
  };

  const handleFieldSubmit = (e) => {
    if (form.formname === "") {
      setAlert(1);
      return;
    }
    if (form.description === "") {
      setAlert(2);
      return;
    }
    if (field.name === "") {
      setAlert(3);
      return;
    }
    if (field.name !== "") {
      setAlert(4);
      setTimeout(() => setAlert(!alert), 1500);
    }
    form.fields.push(field);
    setName("");
  };

  useEffect(() => {
    localStorage.setItem("forms", JSON.stringify(data));
  }, [data]);

  return (
    <>
      <div className=" flex w-full justify-center items-center">
        <Button variant="primary" onClick={handleShow}>
          Create New Form
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Form Name</Form.Label>
              <Form.Control
                autoComplete="off"
                type="text"
                name="formname"
                placeholder="Enter form name"
                onChange={handleFormChange}
                value={form.formname}
                autoFocus
              />
            </Form.Group>
            {alert === 1 ? (
              <Alert variant="danger">Please enter form name.</Alert>
            ) : null}
            {alert === 5 ? (
              <Alert variant="danger">Form name already exist</Alert>
            ) : null}
            <Form.Group className="mb-3">
              <Form.Label>Form Description</Form.Label>
              <Form.Control
                autoComplete="off"
                type="text"
                name="description"
                onChange={handleFormChange}
                placeholder="Enter form description"
                value={form.description}
                autoFocus
              />
            </Form.Group>
            {alert === 2 ? (
              <Alert variant="danger">Please enter form description.</Alert>
            ) : null}
          </Form>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter field name"
                onChange={handleFieldChange}
                value={name}
                name="name"
              />
            </Form.Group>
            {alert === 3 && name === "" ? (
              <Alert variant="danger">Please enter field name.</Alert>
            ) : null}

            <Form.Group className="mb-3">
              <Form.Label>Field Type</Form.Label>
              <Form.Select
                name="dataType"
                onChange={
                  ((e) => {
                    const selectedType = e.target.value;
                    setDataType(selectedType);
                  },
                  handleFieldChange)
                }
                value={field.dataType}
              >
                <option value="text">string</option>
                <option value="password">password</option>
                <option value="email">email</option>
                <option value="number">number</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="required"
                onChange={handleFieldChange}
                label="Required Field"
                value="clicked"
              />
            </Form.Group>
            {alert === 4 ? (
              <Alert show={show} variant="success">
                Field Added
              </Alert>
            ) : null}
            <Button variant="primary" onClick={handleFieldSubmit}>
              Add Field
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FormPopup;
