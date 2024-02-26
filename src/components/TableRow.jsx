import React from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Image from "react-bootstrap/Image";
import { getLs } from "../helpers/getLs";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = getLs("auth-token");

const deleteProduct = async (id, image, name, setState, setData) => {
  console.log(id);

  Swal.fire({
    title: "Desea eliminar este producto?",
    imageUrl: image,
    text: name,
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    denyButtonText: `Cancelar`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        setState(true);
        const res = await axios.delete(`${BASE_URL}/product/${id}`, {
          headers: {
            "auth-token": token,
          },
        });

        if (res.status == 204) {
          Swal.fire("El producto se ha eliminado exitosamente!", "", "success");
          setData((current) => !current);
        }
      } catch (error) {
        console.log(error);
        alert(`Ha ocurrido un error \n ${error}`);
      } finally {
        setState(false);
      }
    }
  });
};

const editVisibility = async (e, setState, id, setData) => {
  const checkboxState = e.target.checked;

  setState(true);
  try {
    const res = await axios.patch(
      `${BASE_URL}/product/${id}`,
      { visible: checkboxState },
      {
        headers: {
          "auth-token": token,
        },
      }
    );

    setData((current) => !current);
  } catch (error) {
    alert(`Ha ocurrido un error \n ${error}`);
  } finally {
    setState(false);
  }
};

export const TableRow = ({
  name,
  price,
  category,
  discount,
  visible,
  id,
  image,
  product,
  setModalState,
  setProductState,
  setChangeVisibilityLoading,
  changeVisibilityLoading,
  deleteProductLoading,
  setDeleteProductLoading,
  setData,
}) => {
  const editHandler = () => {
    setProductState(product);
    setModalState(true);
  };

  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{category}</td>
        <td>{price}</td>
        <td>{discount ? discount : 0}</td>
        <td>
          {changeVisibilityLoading ? (
            <Spinner size="sm" />
          ) : (
            <Form.Check
              type="checkbox"
              defaultChecked={visible}
              onChange={(e) =>
                editVisibility(e, setChangeVisibilityLoading, id, setData)
              }
            />
          )}
        </td>
        <td>
          <Button
            disabled={deleteProductLoading}
            variant="danger"
            className="mx-1"
            size="sm"
            onClick={() =>
              deleteProduct(id, image, name, setDeleteProductLoading, setData)
            }
          >
            {deleteProductLoading ? (
              <>
                {" "}
                Eliminar <Spinner size="sm" />{" "}
              </>
            ) : (
              <>
                Eliminar <i className="bi bi-trash"></i>
              </>
            )}
          </Button>

          <Button
            variant="primary"
            className="mx-1"
            size="sm"
            onClick={editHandler}
          >
            Editar <i className="bi bi-pencil"></i>
          </Button>
        </td>
      </tr>
    </>
  );
};
