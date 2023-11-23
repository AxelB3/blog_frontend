"use client"; // Esto es para poder utilizar el componente a lo largo del proyecto.

import postsService from "@/services/postsService";
// Importaciones de liberias necesarias para crear el card
import React, { useState, useEffect } from "react";
import { Button, useAccordionButton } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { SlLike, SlTrash } from "react-icons/sl";
import Swal from "sweetalert2";

function CustomCard({ isCreationMode, setIsCreationMode, data, setPosts }) {
  const [inputType, setInputType] = useState("text");
  const [dataPost, setDataPost] = useState(data);
  const [disableBtnLike, setDisableBtnLike] = useState(false);
  const [post, setPost] = useState({
    titulo: null,
    descripcion: null,
    autor: null,
    fecha_publicacion: null,
    is_titulo_valid: false,
    is_fecha_publicacion_valid: false,
    is_autor_valid: false,
    is_descripcion_valid: false,
  });

  const error = () => {
    setIsCreationMode(false);
  };

  useEffect(() => {
    // Actualizar datapost cuando data cambia
    setDataPost(data);
  }, [data]);

  // Función handleFocus que cambia el tipo de entrada a "date" cuando se enfoca en un campo de fecha.
  const handleFocus = () => {
    setInputType("date");
  };

  // Función handleBlur que cambia el tipo de entrada a "text" cuando se desenfoca un campo de fecha.
  const handleBlur = () => {
    setInputType("text");
  };

  // Funcion handleChange que recibe un evento de un input para cambia el valor de un campo de entrada.
  const handleChange = (event) => {
    const { name, value } = event.target;

    //Verificar si el valor no es ni vacío ni nulo
    const isNotEmpty = value !== null && value.trim() !== "";

    //Validación por cada campo del formulario
    setPost({ ...post, [name]: value, [`is_${name}_valid`]: isNotEmpty });
  };

  const createNewPost = async () => {
    postsService.createPost(
      post,
      (data) => {
        setPosts(data);
        setIsCreationMode(false);
      },
      Error
    );
  };

  const cancelDialog = () => {
    //MENSAJE EMERGENTE PARA REAFIRMAR QUE SE VA A
    //CANCELAR EL PROCESO DE GUARDADO
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      text: "Se eliminarán los datos ingresados",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsCreationMode(false);
      }
    });
  };

  const deletePost = async (post_id) => {
    postsService.deletePost(
      post_id,
      (data) => {
        setPosts(data);
      },
      Error
    );
  };

  return isCreationMode ? (
    <>
      <Card className="W-100">
        <Card.Body>
          <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
            <Card.Title>Nuevo Post</Card.Title>
            <Form.Control
              type="text"
              name="titulo"
              placeholder="Título"
              onChange={handleChange}
            />
            {post.is_titulo_valid == false && (
              <p className="errores w-100">El campo 'Título' está vacio</p>
            )}
            <Form.Control
              type={inputType}
              name="fecha_publicacion"
              placeholder="Fecha de Publicación"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {post.is_fecha_publicacion_valid == false && (
              <p className="errores w-100">El campo 'Fecha de Publicación' está vacio</p>
            )}
            <Form.Control
              type="text"
              name="autor"
              placeholder="Nombre del Autor"
              onChange={handleChange}
            />
            {post.is_autor_valid == false && (
              <p className="errores w-100">
                El campo 'Nombre del Autor' está vacio
              </p>
            )}
            <Form.Control
              as="textarea"
              name="descripcion"
              rows={3}
              placeholder="Contenido"
              onChange={handleChange}
            />
            {post.is_descripcion_valid == false && (
              <p className="errores w-100">El campo 'Contenido' está vacio</p>
            )}

            <div className="d-flex gap-3">
              <Button
                onClick={createNewPost}
                disabled={
                  !post.is_titulo_valid ||
                  !post.is_fecha_publicacion_valid ||
                  !post.is_autor_valid ||
                  !post.is_descripcion_valid
                }
              >
                Guardar
              </Button>
              <Button onClick={cancelDialog} variant="danger">
                Cancelar
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  ) : (
    <Card className="W-100">
      <Card.Body>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 gap-5">
            <span className="d-flex flex-column gap-2">
              <Card.Title className="my-auto">{dataPost.titulo}</Card.Title>
              <Card.Subtitle>{dataPost.autor}</Card.Subtitle>
            </span>

            <span className="d-flex flex-column">
              <label>{dataPost.fecha_publicacion}</label>
            </span>
          </div>
          <Card.Text style={{textAlign:'justify'}}>{dataPost.descripcion}</Card.Text>
          <span className="d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="none"
              className="border-0"
              onClick={() => {
                deletePost(dataPost.id);
              }}
            >
              <SlTrash />
            </Button>
          </span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;
