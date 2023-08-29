import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Popup(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleButtonClick = (value) => {
    handleClose();
    props.onButtonSelect(value);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='btn-danger'>
        {props.buttonTitle}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.descrip}</p>
        </Modal.Body>
        <Modal.Footer>
          {props.buttons.map((button) => (
            <Button key={button.value} variant={button.variant} onClick={() => handleButtonClick(button.value)}>
              {button.label}
            </Button>
          ))}
        </Modal.Footer>
      </Modal>
    </>
  );
}
