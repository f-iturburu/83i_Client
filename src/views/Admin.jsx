import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/logo.png";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";
import Placeholder from "react-bootstrap/Placeholder";
import Image from "react-bootstrap/Image";
import axios from "axios";
import { TableRow } from "../components/TableRow";
import { getLs } from "../helpers/getLs";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = getLs("auth-token");

export const Admin = () => {
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formDiscount, setFormDiscount] = useState(false);
  const [formAddImage, setFormAddImage] = useState(null);
  const [editFormImage, setEditFormImage] = useState(null);
  const [editProductDiscount, setEditProductDiscount] = useState();
  const [createProductLoading, setCreateProductLoading] = useState();
  const [deleteProductLoading, setDeleteProductLoading] = useState();
  const [editProductLoading, setEditProductLoading] = useState();
  const [changeVisibilityLoading, setChangeVisibilityLoading] = useState();
  const [editProduct, setEditProduct] = useState();
  const [data, setData] = useState();
  const [fetchAllListener, setFetchAllListener] = useState(false);
  const [loading, setLoading] = useState(false);
  const addFormRef = useRef();
  const editFormRef = useRef();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllListener]);

  useEffect(() => {
    setEditProductDiscount(Boolean(editProduct?.discountPercentage));
  }, [editProduct]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products`, {
        headers: {
          "auth-token": token,
        },
      });

      if (res.status == 200) {
        const data = res.data;
        setData(data);
      }
    } catch (error) {

      if (error.response.status == 403) {
        window.location.href = "/";
      }

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setFormDiscount(false);
    setFormAddImage(null);
  };

  const handleShow = () => setShow(true);

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditProductDiscount(false);
  };

  const handleEditModalShow = () => {
    setShowEditModal(true);
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const form = addFormRef.current;
    const data = Object.fromEntries(new FormData(form));
    console.log(data);
    setCreateProductLoading(true);

    
    try {
      const res = await axios.post(`${BASE_URL}/product`, data, {
        headers: {
          "auth-token": token,
        },
      });

      setFetchAllListener((current) => !current);

      if (res.status == 201) {
        handleClose();
        alert("Producto creado exitosamente");
      }
    } catch (error) {
      console.log(error);
      alert(`Ha ocurrido un error \n ${error}`);
    } finally {
      setCreateProductLoading(false);
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const form = editFormRef.current;
    const data = Object.fromEntries(new FormData(form));

    try {
      setEditProductLoading(true);
      const res = await axios.patch(
        `${BASE_URL}/product/${editProduct._id}`,
        data,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      setFetchAllListener((current) => !current);

      if (res.status == 200) {
        handleEditModalClose();
        alert("Producto editado exitosamente");
      }
    } catch (error) {
      alert(`Ha ocurrido un error \n ${error}`);
    } finally {
      setEditProductLoading(false);
    }
  };

  return (
    <>
      <section className="d-flex justify-content-center align-items-center w-100 mt-5">
        <div>
          <img src={Logo} className="d-flex" alt=""></img>
        </div>
        <div className="ms-4 text-start">
          <h1 className="display-5 fw-semibold">Rolling Store</h1>
          <h4 className="">Admin</h4>
        </div>
      </section>
      <section className="container w-100 d-flex justify-content-end mt-2">
        <Button
          variant="outline-light"
          className="ms-auto rounded-2"
          onClick={handleShow}
        >
          <i className="bi bi-plus-lg"></i> Agregar Producto
        </Button>
      </section>
      <section className="container vh-50">
        {loading ? (
          <div className="w-100 text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Descuento (%)</th>
                <th>Visible </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((product) => {
                return (
                  <TableRow
                    key={product._id}
                    product={product}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    discount={product?.discountPercentage}
                    visible={product.visible}
                    image={product.image}
                    id={product._id}
                    setModalState={setShowEditModal}
                    setProductState={setEditProduct}
                    setChangeVisibilityLoading={setChangeVisibilityLoading}
                    changeVisibilityLoading={changeVisibilityLoading}
                    deleteProductLoading={deleteProductLoading}
                    setDeleteProductLoading={setDeleteProductLoading}
                    setData={setFetchAllListener}
                  />
                );
              })}
            </tbody>
          </Table>
        )}
      </section>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={addFormRef} onSubmit={handleAddFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="name" type="text" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Precio</Form.Label>
              <Form.Control name="price" type="number" />
            </Form.Group>
            <Form.Select
              className="form-select mb-3"
              id="categorySelect"
              defaultValue={""}
              name="category"
            >
              <option disabled hidden value="">
                Elegir categoria
              </option>
              <option value="mug">Tazas</option>
              <option value="notepad">Libretas</option>
              <option value="keychain">Llaveros</option>
              <option value="hat">Gorras</option>
              <option value="bottle">Botellas</option>
            </Form.Select>
            <section className="w-100 d-flex justify-content-center">
              <Image
                src={
                  formAddImage ? formAddImage : "/src/assets/placeholder.jpg"
                }
                style={{
                  height: "612px",
                  width: "612px",
                  objectFit: "contain",
                }}
                rounded
              />
            </section>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                name="image"
                onChange={(e) => setFormAddImage(e.target.value)}
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                onChange={() => setFormDiscount(!formDiscount)}
                label="Descuento"
              />
            </Form.Group>

            {formDiscount ? (
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Porcentaje de descuento </Form.Label>
                <Form.Control name="discountPercenteage" type="number" />
              </Form.Group>
            ) : (
              ""
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            disabled={editProductLoading}
            onClick={handleAddFormSubmit}
          >
            {editProductLoading ? <Spinner size="sm" /> : "Crear"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={handleEditModalClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={editFormRef} onSubmit={handleEditFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="name" type="text" defaultValue={editProduct?.name} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                name="price"
                type="number"
                defaultValue={editProduct?.price}
              />
            </Form.Group>
            <Form.Select
              className="form-select mb-3"
              id="categorySelect"
              defaultValue={editProduct?.category}
              name="category"
            >
              <option disabled hidden value="">
                Elegir categoria
              </option>
              <option value="mug">Tazas</option>
              <option value="notepad">Libretas</option>
              <option value="keychain">Llaveros</option>
              <option value="hat">Gorras</option>
              <option value="bottle">Botellas</option>
            </Form.Select>
            <section className="w-100 d-flex justify-content-center">
              <Image
                src={editProduct?.image}
                style={{
                  height: "612px",
                  width: "612px",
                  objectFit: "contain",
                }}
                rounded
              />
            </section>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                name="image"
                defaultValue={editProduct?.image}
                onChange={(e) => setEditFormImage(e.target.value)}
                type="text"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                defaultChecked={Boolean(editProduct?.discountPercentage)}
                onChange={(e) => {
                  setEditProductDiscount(e.target.checked);
                }}
                label="Descuento"
              />
            </Form.Group>

            {editProductDiscount ? (
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Porcentaje de descuento </Form.Label>
                <Form.Control
                  name="discountPercentage"
                  defaultValue={editProduct?.discountPercentage}
                  type="number"
                />
              </Form.Group>
            ) : (
              ""
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleEditModalClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            disabled={editProductLoading}
            onClick={handleEditFormSubmit}
          >
            {editProductLoading ? <Spinner size="sm" /> : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
