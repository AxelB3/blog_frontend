"use client";

import styles from "./page.module.css";
import CustomCard from "@/components/Cards/Card";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import tasksService from "@/services/postsService";
import Swal from "sweetalert2";
import postsService from "@/services/postsService";

export default function Home() {
  // Variable para poder manejar cuando se necesite crear un nuevo card
  const [newPost, setNewPost] = useState(false);
  const [posts, setPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(null);

  //Trae todas los posts existentes
  useEffect(() => {
    postsService.getPosts(setPosts);
  }, []);

  // Funcion que cambia el estado de mi newPost cuando se necesite crear un nuevo card
  const CreateNewPost = () => {
    setNewPost(!newPost);
    setSearchText("");
  };

  //useEffect se encarga de ejecutarse cuando haya cambios tanto en searchText como en posts, esto con el fin de filtrar
  useEffect(() => {
    if (searchText === "") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
          post.autor.toLowerCase().includes(searchText.toLowerCase()) ||
          post.descripcion.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, posts]);


  return (
    <main className={styles.main}>
      <div className={"p-3"}>
        {!newPost && <Button onClick={CreateNewPost}>Crear Nuevo Post</Button>}
      </div>

      {newPost && (
        <Row className="w-100 justify-content-center gap-3">
          <Col sm={8} md={6} xs={"auto"}>
            <CustomCard
              isCreationMode={newPost}
              setIsCreationMode={CreateNewPost}
              setPosts={setPosts}
            />
          </Col>
        </Row>
      )}

      <Row className="w-100 justify-content-center gap-3 py-4">
        {filteredPosts &&
          <Col sm={8} md={6} xs={"auto"}>
            <Form.Control
              type="text"
              name="filter"
              placeholder="Buscar por título, autor o contenido"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </Col>
        }
        {filteredPosts?.map((post, index) => {
          return (
            <Col key={index} sm={8} md={6} xs={"auto"}>
              <CustomCard data={post} onChangeData={post} setPosts={setPosts}/>
            </Col>
          );
        })}
      </Row>
    </main>
  );
}
